import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import remarkFrontmatter from "remark-frontmatter";
import { remark } from "remark";
import type { Literal, Node, Parent } from "unist";
import type { VFile } from "vfile";
import * as YAML from "yaml";

declare module "vfile" {
  interface DataMap {
    frontmatter: Record<string, any>;
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const licensesDir = resolve(__dirname, "licenses");
const outDir = resolve(__dirname, "dist");

await fs.rm(outDir, { force: true, recursive: true });
await fs.mkdir(outDir);

const files = await fs.readdir(licensesDir);

const promises = files.map(async (file) => {
  const content = await fs.readFile(resolve(licensesDir, file), "utf-8");
  const license = await remark()
    .use(remarkFrontmatter)
    .use(() => {
      return (tree: Parent, file: VFile) => {
        const node: Literal | null = tree.children.shift() as any;
        if (!node || node.type !== "yaml" || typeof node.value !== "string")
          return file.message("No yaml node.");

        let frontmatter: any;
        try {
          frontmatter = YAML.parse(node.value);
        } catch (err) {
          file.fail(err, node);
        }

        file.data.frontmatter = frontmatter;
      };
    })
    .process(content);

  const output = { ...license.data.frontmatter, text: license.value };
  await fs.writeFile(
    resolve(outDir, file.replace(".md", ".json")),
    JSON.stringify(output, null, 2),
  );
});

await Promise.all(promises);
