oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g license
$ license COMMAND
running command...
$ license (--version)
license/2.0.0 darwin-arm64 node-v18.18.2
$ license --help [COMMAND]
USAGE
  $ license COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`license [LICENSE]`](#license-license)
* [`license hello PERSON`](#license-hello-person)
* [`license hello world`](#license-hello-world)
* [`license help [COMMANDS]`](#license-help-commands)

## `license [LICENSE]`

meow

```
USAGE
  $ license  [LICENSE] [-e] [-r] [-y <value>]

ARGUMENTS
  LICENSE  The SPDX identifier, or full name, of the license to use

FLAGS
  -e, --exact         Don't bring up the interactive search if no match was found
  -r, --raw           Print the license text to stdout
  -y, --year=<value>  [default: 2023] Set the year for the license

DESCRIPTION
  meow
```

_See code: [src/commands/index.ts](https://github.com/Ovyerus/license/blob/v2.0.0/src/commands/index.ts)_

## `license hello PERSON`

Say hello

```
USAGE
  $ license hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Ovyerus/license/blob/v2.0.0/src/commands/hello/index.ts)_

## `license hello world`

Say hello world

```
USAGE
  $ license hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ license hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Ovyerus/license/blob/v2.0.0/src/commands/hello/world.ts)_

## `license help [COMMANDS]`

Display help for license.

```
USAGE
  $ license help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for license.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_
<!-- commandsstop -->
