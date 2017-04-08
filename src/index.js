import fs from 'fs';
import path from 'path';

import findBabelConfig from 'find-babel-config';
import glob from 'glob';
import transformCall from './transformers/call';
import transformImport from './transformers/import';


const defaultExtensions = ['.js', '.jsx', '.es', '.es6'];

function isRegExp(string) {
  return string.startsWith('^') || string.endsWith('$');
}

function normalizeCwd(file) {
  const { opts } = this;

  if (opts.cwd === 'babelrc') {
    const startPath = (file.opts.filename === 'unknown')
      ? './'
      : file.opts.filename;

    const { file: babelPath } = findBabelConfig.sync(startPath);

    opts.cwd = babelPath
      ? path.dirname(babelPath)
      : null;
  }

  if (!opts.cwd) {
    opts.cwd = process.cwd();
  }
}

function normalizePluginOptions(file) {
  const { opts } = this;

  normalizeCwd.call(this, file);

  if (opts.root) {
    if (typeof opts.root === 'string') {
      opts.root = [opts.root];
    }
    opts.root = opts.root.reduce((resolvedDirs, dirPath) => {
      if (glob.hasMagic(dirPath)) {
        return resolvedDirs.concat(
          glob.sync(dirPath)
            .filter(resolvedPath => fs.lstatSync(resolvedPath).isDirectory()),
        );
      }
      return resolvedDirs.concat(dirPath);
    }, []);
  } else {
    opts.root = [];
  }

  opts.regExps = [];

  if (opts.alias) {
    Object.keys(opts.alias)
      .filter(isRegExp)
      .forEach((key) => {
        const parts = opts.alias[key].split('\\\\');

        function substitute(execResult) {
          return parts
            .map(part =>
              part.replace(/\\\d+/g, number => execResult[number.slice(1)] || ''),
            )
            .join('\\');
        }

        opts.regExps.push([new RegExp(key), substitute]);

        delete opts.alias[key];
      });
  } else {
    opts.alias = {};
  }

  if (!opts.extensions) {
    opts.extensions = defaultExtensions;
  }

  return opts;
}

export default ({ types }) => {
  const importVisitors = {
    CallExpression(nodePath, state) {
      transformCall(types, nodePath, state);
    },
    ImportDeclaration(nodePath, state) {
      transformImport(types, nodePath, state);
    },
    ExportDeclaration(nodePath, state) {
      transformImport(types, nodePath, state);
    },
  };

  return {
    pre: normalizePluginOptions,

    visitor: {
      Program: {
        exit(programPath, state) {
          programPath.traverse(importVisitors, state);
        },
      },
    },
  };
};
