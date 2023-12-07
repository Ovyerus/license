# license

> Easily generate licenses for your projects!

> [!NOTE]
> This is currently undergoing a major rewrite. Code in this repository may not be fully working, if you wish

<!-- AUTO-GENERATED-CONTENT:START (TOC:collapse=true&collapseText=Table of Contents) -->
<details>
<summary>Table of Contents</summary>

- [What is this?](#what-is-this)
- [Usage](#usage)
- [Examples](#examples)
- [Advanced Usage](#advanced-usage)
  * [Name](#name)
  * [Email](#email)
  * [Year](#year)
  * [Project](#project)
  * [Default License](#default-license)
- [API Usage](#api-usage)
  * [Getting a license you know](#getting-a-license-you-know)
  * [Getting a list of licenses that match a search term](#getting-a-list-of-licenses-that-match-a-search-term)
- [API Docs](#api-docs)
  * [getLicense(license[, replacements]) => string](#getlicenselicense-replacements--string)
  * [findLicense(search[, osiOnly = true]) => string[]](#findlicensesearch-osionly--true--string)
- [License](#license)

</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## What is this?

Have you ever started a new project, and needed to add a new license to it but
don't know the exact wording off by heart (because who would)? You have to
search for the license you want, copy its text, paste it into a new file, and
then check to see if there's anything like copyright information that you need
to update.

License is a super easy to use CLI tool for streamlining the LICENSE file
creation process. With a super simple but powerful CLI inspired by tools such as
[now](https://github.com/zeit/now), setting up a license for your new project
has never been easier!

## Usage

First, globally install license through your package manager of choice.

```sh
$ yarn global add license
# or
$ npm i -g license
```

And then simply run `license` to generate a license.

```
$ license [license]
```

If you don't specify a license to generate, it'll either pick from your config,
or show an interactive prompt for you to search through.

If you don't want to install license and just want to run it once, you can use
`npx`

```sh
$ npx license [license]
# Or using Yarn 2.x
$ yarn dlx license [license]
```

## Examples

todo

## Advanced Usage

By default, license will try to guess your name, email, the current project, and
the current year to use in the license it generates. You can override these in a
number of ways though.

### Name

By default, license will try to get your name from your Git configuration,
(`git config --global user.name`). If it fails to, it will fallback to using the
`USER` environment variable, often your username in a shell.

You can override this in two ways:

1. Overriding it as a one time thing by providing a `--name` option while
   running `license` (also alised to `-n`).
2. Overriding it permanently by using `license config --name <name>`, which will
   add it to the global config, and will be used for any future calls to
   `license`, unless the `--name` option above is used, in which case that will
   take precedence.

### Email

By default, license will try to get your email from your Git configuration, just
like it does with your name, (`git config --global user.email`), however it does
not have any fallback to use, so it's recommended you use either of the two
override methods below.

1. Overriding it as a one time thing by providing an `--email` option while
   running `license` (also aliased to `-e`).
2. Overriding it permanently by using `license config --email <email>`, which
   will add it to the global config, and will be used for any future calls to
   `license`, unless the `--email` option above is used, in which case that will
   take precedence.

### Year

By default, license will use the current year (according to your system time) to
fill in, however you can set a custom year using the `--year` option to
`license`.

It supports a couple formats for the year:

1. a plain year - `2009`
2. a year range - `2005-2009`
3. a list of years - `2004, 2006, 2007` - also supports ranges in it -
   `2004, 2005-2009, 2011`

### Project

By default, license will use the directory it's making the license file in as
the name of the project, however in case the directory's name doesn't match the
project name or whatever, you can override the name using the `--projectName`
option to `license`.

If you want to change the directory the license gets generated in, without
needing to `cd` into it, you can supply the `--project` option (aliased to `-p`)
with a path to the directory instead, and it'll generate the license there.
It'll also change the project name set to that of the directory, unless you
specify the `--projectName` option above.

### Default License

If you wish to be able to run `license` without having to specify the same
license everytime - say you just want to use the MIT License everywhere because
that's your go-to. You can set what license gets generated by default with
`license config --license <license>`, and it will procede to use that for all
future calls without you need to specify MIT as the license every single time.

You can of course override this decision by specifying a license to when you
call `license` via the normal usage, this just changes the default empty
behaviour from the search prompt to auto filling a license.

## API Usage

You can also use the core functionality of `license` through a simple API

### Getting a license you know

```js
import { getLicense } from "license";

// Get license template text
console.log(getLicense("MIT"));

// Fill out some info
console.log(getLicense("MIT", { author: "Ovyerus", year: "2020" }));
```

### Getting a list of licenses that match a search term

```js
import { findLicense } from "license";

console.log(findLicense("mi"));
// [ 'MIT', 'MirOS', 'Multics', 'MPL-2.0-no-copyleft-exception' ]

console.log(findLicense("mit"));
// [ 'MIT' ] (exact match)

// Showing more licenses than just OSI-approved
console.log(findLicense("mi", false));
// [
//   'CDLA-Permissive-1.0',
//   'MIT',
//   'MIT-0',
//   'MIT-CMU',
//   'MIT-advertising',
//   'MIT-enna',
//   'MIT-feh',
//   'MITNFA',
//   'MirOS',
//   ...
// ]
```

Combined, you can provide a powerful searching experience for a license without
needing your users to exactly remember the name of what they want.

## API Docs

### getLicense(license[, replacements]) => string

Get the body text of a given license, optionally filling in any placeholder
values with given values, such as author or date.

**license (string)**

The name of the license to get/fill in. Must be an exact match including
capitalisation.

**replacements (object)**

A plain `key: value` object used to populate given any present placeholders in
the license text, where `key` is used as the placeholder's name, and `value` is
what replaces the placeholder.

### findLicense(search[, osiOnly = true]) => string[]

Get a list of possible matching license identifiers, given a string - possibly
user input. If the input is an exact matchs (sans capitalisation), it'll return
only that as a result, to make it easier to determine if the user got the search
right.

**search (string)**

The string to search through all the identifiers for a match.

**osiOnly (boolean)**

Determines whether or not to only show only OSI-approved licenses in the
results. Defaults to `true`.

## License

This repository and the code inside it is licensed under the MIT License. Read
[LICENSE](./LICENSE) for more information.
