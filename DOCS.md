* [Getting Started](#getting-started)
* [Options](#options)
  * [root](#root)
  * [alias](#alias)
  * [extensions](#extensions)
  * [cwd](#cwd)
  * [transformFunctions](#transformfunctions)
  * [resolvePath](#resolvepath)
* [Usage with React Native](#usage-with-react-native)
* [Usage with Flow](#usage-with-flow)
* [For plugin authors](#for-plugin-authors)

# Getting Started

Install the plugin

```
$ npm install --save-dev babel-plugin-module-resolver
```

Specify the plugin in your `.babelrc` with the custom root or alias. Here's an example:
```json
{
  "plugins": [
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "test": "./test",
        "underscore": "lodash"
      }
    }]
  ]
}
```

# Options

## root

A string or an array of root directories. Specify the paths or a glob path (eg. `./src/**/components`)
`node_modules` is an implicit root as it is a default directory to resolve modules

## alias

A map of alias. You can also alias `node_modules` dependencies, not just local files.

### Regular expressions

It is possible to specify an alias using a regular expression. To do that, either start an alias with `'^'` or end it with `'$'`:

```json
{
  "plugins": [
    ["module-resolver", {
      "alias": {
        "^@namespace/foo-(.+)": "packages/\\1"
      }
    }]
  ]
}
```

Using the config from this example `'@namespace/foo-bar'` will become `'packages/bar'`.

You can reference the n-th matched group with `'\\n'` (`'\\0'` refers to the whole matched path).

To use the backslash character (`\`) just escape it like so: `'\\\\'` (double escape is needed because of JSON already using `\` for escaping).

## extensions

An array of extensions used in the resolver.

```json
{
  "plugins": [
    ["module-resolver", {
      "extensions": [".js", ".jsx", ".es", ".es6", ".mjs"]
    }]
  ]
}
```

## cwd

By default, the working directory is the one used for the resolver, but you can override it for your project.
* The custom value `babelrc` will make the plugin look for the closest babelrc configuration based on the file to parse.
* The custom value `packagejson` will make the plugin look for the closest `package.json` based on the file to parse.

## transformFunctions

Array of functions and methods that will have their first argument transformed. By default those methods are: `require`, `require.resolve`, `System.import`, `jest.genMockFromModule`, `jest.mock`, `jest.unmock`, `jest.doMock`, `jest.dontMock`.

```json
{
  "plugins": [
    ["module-resolver", {
      "transformFunctions": [
          "require", 
          "require.resolve",
          "System.import",
          "jest.genMockFromModule",
          "jest.mock",
          "jest.unmock",
          "jest.doMock",
          "jest.dontMock"
      ]
    }]
  ]
}
```

## resolvePath

String poiting to a JavaScript file exporting a function. That function is called for each path in the project. By default `module-resolver` is using an internal function.

```json
{
  "plugins": [
    ["module-resolver", {
      "extensions": [".js"],
      "resolvePath": "./scripts/resolvePath.js"
    }]
  ]
}
```

```js
// myapp/scripts/resolvePath.js

export default function resolvePath(sourcePath, currentFile, opts) {
    /**
     * The `opts` argument is the options object that is passed through the Babel config.
     * opts = {
     *   "extensions": [".js"],
     *   "resolvePath": "./scripts/resolvePath.js"
     * }
     */
    return "resolvedPath";
}
```

# Usage with React Native

To let the packager resolve the right module for each platform, you have to add the ```.ios.js```and ```.android.js``` extensions :

```json
{
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./src"],
        "extensions": [".js", ".ios.js", ".android.js"]
      }
    ]
  ]
}
```

# Usage with Flow

To allow Flow to find your modules, add configuration options
to `.flowconfig`.

For example, a React component is located at `src/components/Component.js`

```js
// Before
import '../../src/components/Component';

// After - Flow cannot find this now
import 'components/Component';
```

Instruct Flow where to resolve modules from:

```
# .flowconfig

[options]
module.system.node.resolve_dirname=node_modules
module.system.node.resolve_dirname=./src
```

Be sure to add any sub-directories if you refer to files further down the
directory tree:

```js
// Located at src/store/actions
import 'actions/User'
```
```
module.system.node.resolve_dirname=src/store
```

Or you may use `name_mapper` option for manual listing (tested with Flow 0.45):

```diff
# .flowconfig

[options]
; Be careful with escaping characters in regexp
- module.name_mapper='^app\/(.*)$' -> '<PROJECT_ROOT>/app/\1' # does not work
+ module.name_mapper='^app\/\(.*\)$' -> '<PROJECT_ROOT>/app/\1' # work as expected

; Other modules
module.name_mapper='^i18n\/\(.*\)$' -> '<PROJECT_ROOT>/i18n/\1'
module.name_mapper='^schema\/\(.*\)$' -> '<PROJECT_ROOT>/schema/\1'
module.name_mapper='^mongoose-elasticsearch-xp\(.*\)$' -> '<PROJECT_ROOT>/lib/mongoose-elasticsearch-xp\1'
```

More configuration options are located in [the Flow documentation](https://flowtype.org/docs/advanced-configuration.html)

# For plugin authors

Aside from the main export, which is the plugin itself as needed by Babel, there is a function used internally that is exposed:

```js
import { resolvePath } from 'babel-plugin-module-resolver';

// `opts` are the options as passed to the Babel config (should have keys like "root", "alias", etc.)
const realPath = resolvePath(sourcePath, currentFile, opts);
```

For each path in the file you can use `resolvePath` to get the same path that module-resolver will output.

`currentFile` can be either a relative path (will be resolved with respect to the CWD, not `opts.cwd`), or an absolute path.