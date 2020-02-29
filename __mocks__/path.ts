const realPath: typeof import("path") = jest.requireActual("path");
const path: typeof import("path") = jest.genMockFromModule("path");

/* eslint-disable @typescript-eslint/unbound-method */
path.resolve = (p: string) => (p === "." ? "/project" : realPath.resolve(p));
path.basename = realPath.basename.bind(realPath);
/* eslint-enable */

export = path;
