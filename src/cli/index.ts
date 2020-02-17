#!/usr/bin/env node
import ConfigStore from 'configstore';
import gitPath from 'git-config-path';
import { sync as parseGitConfig } from 'parse-git-config';
import { all } from 'rambda';
import yargs from 'yargs';

import fs from 'fs';
import path from 'path';

import config from './config';
import run from './run';

const pkg = JSON.parse(
  // eslint-disable-next-line no-sync
  fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8')
);
const gitConfig = () => parseGitConfig({ cwd: '/', path: gitPath('global') });

// TODO: maybe have a fallback before git, be npm???
const getUserName = (): string =>
  cfg.get('name') || gitConfig().user.name || process.env.USER;
const getUserEmail = (): string => cfg.get('email') || gitConfig().user.email;

const validateYear = (year: string) => {
  const split = year.split('-');

  if (
    /^\d{4}$/.test(year) ||
    (split.length === 2 && all(x => /^\d{4}$/.test(x), split)) ||
    /^(?:\d{4}(?:, ?)?)+$/.test(year)
  )
    return year;
  else
    throw new Error(
      'Year should either be a standalone year `2020`, a year range `2019-2020`, or a list of years `1999, 2003, 2005`'
    );
};

export const cfg = new ConfigStore(pkg.name);

// if (something) {
main();
// }

export default function main() {
  return yargs
    .scriptName(pkg.name)
    .version(pkg.version)
    .usage('todo')
    .command(
      '$0 [license]',
      'Generate a license file.',
      yargs => {
        yargs
          .positional('license', {
            type: 'string',
            default: cfg.get('license') || null,
            describe: 'License to use'
          })
          .option('n', {
            alias: 'name',
            default: getUserName(),
            describe: "The copyright owner's name.",
            type: 'string'
          })
          .option('e', {
            alias: 'email',
            default: getUserEmail(),
            describe: "The copyright owner's email address."
          })
          .option('y', {
            alias: 'year',
            default: new Date().getFullYear().toString(),
            describe: 'The copyright year.',
            type: 'string'
          })
          .option('raw', {
            default: false,
            describe: "Print out the license's template.",
            type: 'boolean'
          })
          .option('non-osi', {
            default: false,
            describe:
              'Whether to show non-OSI approved licenses in the license prompt.',
            type: 'boolean'
          })
          .coerce('year', validateYear);
      },
      run
    )
    .command(
      'config',
      'Set and view config',
      yargs => {
        yargs
          .option('name', {
            describe: 'Name to use by default.',
            type: 'string'
          })
          .option('email', {
            describe: 'Email to use by default.',
            type: 'string'
          })
          .option('license', {
            describe: 'License to use if none is specified.',
            type: 'string'
          });
      },
      config
    )
    .help().argv;
}
