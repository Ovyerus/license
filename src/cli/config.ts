import { Identifiers } from '@ovyerus/licenses';
import identifiers from '@ovyerus/licenses/simple';

import { cfg } from '.';

interface ConfigArgv {
  name?: string;
  license?: string;
  email?: string;
}

export default function config({ name, license, email }: ConfigArgv) {
  if (!name && !license && !email) {
    if (cfg.get('name')) console.log(`name=${cfg.get('name')}`);
    if (cfg.get('license')) console.log(`license=${cfg.get('license')}`);
    if (cfg.get('email')) console.log(`email=${cfg.get('email')}`);
  }

  if (license) {
    if (!identifiers.has(license as Identifiers[number]))
      throw new Error('license must be a valid SPDX identifier');
    cfg.set({ license });
  }

  if (name) cfg.set({ name });
  if (email) cfg.set({ email });
}
