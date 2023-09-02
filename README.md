unreadconfig
===


Find and load configuration from a `package.json` property, `rc` file, or `CommonJS` module. It has smart default based on traditional expectations in the JavaScript ecosystem. But it's also flexible enough to search anywhere you want and load whatever you want.

## Features

- Support [JSON](https://www.json.org), [JSONC](https://github.com/microsoft/node-jsonc-parser), [JSON5](https://json5.org/), [YAML](https://yaml.org/), [TOML](https://toml.io), [INI](https://en.wikipedia.org/wiki/INI_file), [CJS](http://www.commonjs.org), [Typescript](https://www.typescriptlang.org/), and ESM config load.
- Reads config from the nearest `package.json` file

## Install

```bash
$ npm i unreadconfig
```

## Quick start

```js
const { readConfig } = require('unreadconfig');

import { readConfig } from 'unreadconfig';

// will look for:
// process.cwd() + '.namespacerc'
// process.cwd() + '.namespacerc.js'
// process.cwd() + '.namespacerc.ts'
// process.cwd() + '.namespacerc.mjs'
// process.cwd() + '.namespacerc.cjs'
// process.cwd() + '.namespacerc.json'
// process.cwd() + '.namespacerc.json5'
// process.cwd() + '.namespacerc.jsonc'
// process.cwd() + '.namespacerc.yaml'
// process.cwd() + '.namespacerc.yml'
// process.cwd() + '.namespacerc.toml'
// process.cwd() + 'namespace.config.mjs'
// process.cwd() + 'namespace.config.cjs'
// process.cwd() + 'namespace.config.js'
// ........
const data = readConfig('namespace', {
  default: {
    testItem2: 'some value'
  }
});
```

## Load JS

Load the JS file and return the result, support `.js`, `.cjs`, `.mjs`, `.ts`.

```js
// => ./app/app.config.js
export default {
  name: 'app'
}
```

```ts
import { loadConf } from 'unreadconfig/load-conf';

interface Config {
  name: string;
}

const result = loadConf<Config>(path.resolve(process.cwd(), 'app/app.config.js'));
// => { name: 'app' }
```

## Option

```ts
import { LoadConfOption } from 'unreadconfig';
export type LoaderFunc<T> = (filepath: string, content: string, jsOption?: LoadConfOption) => T;
export type Loader<T> = Record<string, LoaderFunc<T>>;
export interface readConfigOption<T> {
  searchPlaces?: string[];
  /** An object that maps extensions to the loader functions responsible for loading and parsing files with those extensions. */
  loaders?: Loader<T>;
  /** Specify default configuration. It has the lowest priority and is applied after extending config. */
  defaluts?: T;
  /** Resolve configuration from this working directory. The default is `process.cwd()` */
  cwd?: string;
  /** Default transform js configuration */
  jsOption?: LoadConfOption;
  /** @deprecated use `mustExist` instead */
  ignoreLog?: boolean;
  mustExist?: boolean;
}
/**
 * Find and load configuration from a `package.json` property, `rc` file, or `CommonJS` module.
 * @param namespace {string} Configuration base name. The default is `readConfig`.
 * @param option
 */
export default function readConfig<T>(namespace?: string, option?: readConfigOption<T>): {} & T;
```

Discover configurations in the specified directory order. When configuring a tool, you can use multiple file formats and put these in multiple places. Usually, a tool would mention this in its own README file, but by default, these are the following places, where `${moduleName}` represents the name of the tool:

**Default `searchPlaces`:**

```js
[
  'package.json',
  `.${moduleName}rc`,
  `.${moduleName}rc.json`,
  `.${moduleName}rc.json5`,
  `.${moduleName}rc.jsonc`,
  `.${moduleName}rc.yaml`,
  `.${moduleName}rc.yml`,
  `.${moduleName}rc.toml`,
  `.${moduleName}rc.ini`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.ts`,
  `.${moduleName}rc.cjs`,
  `.${moduleName}rc.mjs`,
  `.config/${moduleName}rc`,
  `.config/${moduleName}rc.json`,
  `.config/${moduleName}rc.json5`,
  `.config/${moduleName}rc.jsonc`,
  `.config/${moduleName}rc.yaml`,
  `.config/${moduleName}rc.yml`,
  `.config/${moduleName}rc.toml`,
  `.config/${moduleName}rc.ini`,
  `.config/${moduleName}rc.js`,
  `.config/${moduleName}rc.ts`,
  `.config/${moduleName}rc.cjs`,
  `.config/${moduleName}rc.mjs`,
  `${moduleName}.config.js`,
  `${moduleName}.config.ts`,
  `${moduleName}.config.cjs`,
  `${moduleName}.config.mjs`,
]
```

Configurations are loaded sequentially, and the configuration file search is terminated when a configuration file exists.


The content of these files is defined by the tool. For example, you can add a `semi` configuration value to `false` using a file called `.config/readConfig.yml`:

```yml
semi: true
```

Additionally, you have the option to put a property named after the tool in your `package.json` file, with the contents of that property being the same as the file contents. To use the same example as above:

```js
{
  "name": "your-project",
  "readConfig": {
    "semi": true
  }
}
```

This has the advantage that you can put the configuration of all tools (at least the ones that use `unreadconfig`) in one file.

## loader

### `.js`,`.ts`,`.cjs`,`.mjs`

```ts
import type { JITIOptions } from 'jiti/dist/types';
import { Options } from 'sucrase';
export interface LoadConfOption {
  jiti?: boolean;
  jitiOptions?: JITIOptions;
  transformOption?: Options;
}
export declare function loadConf<T>(path: string, option?: LoadConfOption): T;
export declare function jsLoader<T>(filepath: string, content: string, option?: LoadConfOption): T;
```

Modify default `.js`,`.ts`,`.cjs`,`.mjs` loader parameters.

```js
import { readConfig, jsLoader } from 'unreadconfig';

function loadJS(filepath, content) {
  return jsLoader(filepath, content, {
    // change option...
  });
}

const data = readConfig('namespace', {
  loaders: {
    '.js': loadJS,
    '.ts': loadJS,
    '.cjs': loadJS,
    '.mjs': loadJS,
  },
  default: {
    testItem2: 'some value'
  }
});
```

example:

```ts
import { jsLoader } from 'unreadconfig';

const data = jsLoader('/path/to/file/name.js')
```

### `.ini`

```ts
export declare function iniLoader<T>(_: string, content: string): T;
```

example:

```ts
import { iniLoader } from 'unreadconfig';

const data = iniLoader(undefined, `...`)
```

### `.json`,`.jsonc`, `json5`

```ts
export declare function jsonLoader<T>(_: string, content: string): T;
```

example:

```ts
import { jsonLoader } from 'unreadconfig';

const data = jsonLoader(undefined, `{ "a": 123 }`)
```

### `.toml`

```ts
export declare function tomlLoader<T>(_: string, content: string): T;
```

example:

```ts
import { tomlLoader } from 'unreadconfig';

const data = tomlLoader(undefined, `...`)
```

### `.yaml`

```ts
export declare function yamlLoader<T>(_: string, content: string): T;
```

example:

```ts
import { yamlLoader } from 'unreadconfig';

const data = yamlLoader(undefined, `...`)
```

## Custom `Yaml` loader

This is an example, the default `yaml`/`yml` does not require a loader.

```js
import { readConfig } from 'unreadconfig';
import yaml from 'yaml';

function loadYaml(filepath, content) {
  return yaml.parse(content);
}

const data = readConfig('namespace', {
  searchPlaces: [
    '.namespacerc.yaml',
    '.namespacerc.yml',
  ],
  loaders: {
    '.yaml': loadYaml,
    '.yml': loadYaml,
  },
  default: {
    testItem2: 'some value'
  }
});
```

## utils

### merge

```ts
export declare const merge: {
  <TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
  <TObject_1, TSource1, TSource2>(object: TObject_1, source1: TSource1, source2: TSource2): TObject_1 & TSource1 & TSource2;
  <TObject_2, TSource1_1, TSource2_1, TSource3>(object: TObject_2, source1: TSource1_1, source2: TSource2_1, source3: TSource3): TObject_2 & TSource1_1 & TSource2_1 & TSource3;
  <TObject_3, TSource1_2, TSource2_2, TSource3_1, TSource4>(object: TObject_3, source1: TSource1_2, source2: TSource2_2, source3: TSource3_1, source4: TSource4): TObject_3 & TSource1_2 & TSource2_2 & TSource3_1 & TSource4;
  (object: any, ...otherArgs: any[]): any;
};
```

### findConfigFile

```ts
export declare function findConfigFile(moduleName: string, root: string, searchPlaces?: string[]): string;
```

### getConfigPath

```ts
export declare const getConfigPath: () => string;
```

Example:

```ts
import { readConfig, getConfigPath } from 'unreadconfig';

const data = readConfig<Config>('idoc');
const configPath = getConfigPath();
// => /.readConfigrc.js
```

## Related

- [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) Find and load configuration from a package.json property, rc file, or CommonJS module
- [cjson](https://www.npmjs.com/package/cjson) Comments enabled json loader (Commented JavaScript Object Notation)
- [Config Loader](https://www.npmjs.com/package/@web/config-loader) Load user config files for node js projects.
- [Lilconfig](https://www.npmjs.com/package/lilconfig) Zero-dependency nodejs config seeker.
- [proload](https://github.com/natemoo-re/proload) Searches for and loads your tool's JavaScript configuration files with full support for CJS, ESM, TypeScript and more.
- [rc](https://github.com/dominictarr/rc) The non-configurable configuration loader for lazy people.
