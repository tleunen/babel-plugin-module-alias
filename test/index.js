/* eslint-env mocha */
import path from 'path';

import assert from 'assert';
import { transform } from 'babel-core';
import plugin, { mapToRelative } from '../src';

describe('Babel plugin module alias', () => {
    const transformerOpts = {
        plugins: [
            [plugin, [
                {
                    src: './src/mylib/subfolder/utils',
                    expose: 'utils'
                },
                {
                    src: './src/mylib/subfolder/utils2',
                    expose: 'myapp/utils2'
                }
            ]]
        ]
    };

    describe('should alias a known path', () => {
        describe('when requiring the exposed name', () => {
            it('with a require statement', () => {
                const code = 'var utils = require("utils");';
                const result = transform(code, transformerOpts);

                assert.equal(result.code, 'var utils = require("./src/mylib/subfolder/utils");');
            });

            it('with an import statement', () => {
                const code = 'import utils from "utils";';
                const result = transform(code, transformerOpts);

                assert.equal(result.code, 'import utils from "./src/mylib/subfolder/utils";');
            });
        });

        describe('when requiring the exposed with full path', () => {
            it('with a require statement', () => {
                const code = 'var utils = require("myapp/utils2");';
                const result = transform(code, transformerOpts);

                assert.equal(result.code, 'var utils = require("./src/mylib/subfolder/utils2");');
            });

            it('with an import statement', () => {
                const code = 'import utils from "myapp/utils2";';
                const result = transform(code, transformerOpts);

                assert.equal(result.code, 'import utils from "./src/mylib/subfolder/utils2";');
            });
        });

        describe('when requiring a sub file of the exposed name', () => {
            it('with a require statement', () => {
                const code = 'var myUtil = require("utils/my-util-file");';
                const result = transform(code, transformerOpts);

                assert.equal(result.code, 'var myUtil = require("./src/mylib/subfolder/utils/my-util-file");');
            });

            it('with an import statement', () => {
                const code = 'import myUtil from "utils/my-util-file";';
                const result = transform(code, transformerOpts);

                assert.equal(result.code, 'import myUtil from "./src/mylib/subfolder/utils/my-util-file";');
            });
        });
    });

    describe('should not alias a unknown path', () => {
        it('with a require statement', () => {
            const code = 'var otherLib = require("other-lib");';
            const result = transform(code, transformerOpts);

            assert.equal(result.code, 'var otherLib = require("other-lib");');
        });

        it('with an import statement', () => {
            const code = 'import otherLib from "other-lib";';
            const result = transform(code, transformerOpts);

            assert.equal(result.code, 'import otherLib from "other-lib";');
        });
    });

    describe('should map to relative path when cwd has been changed', () => {
        const cwd = process.cwd();

        before(() => {
            process.chdir(path.join(process.env.PWD, './test'));
        });

        after(() => {
            process.chdir(cwd);
        });

        it('with relative filename', () => {
            const currentFile = './utils/test/file.js';
            const result = mapToRelative(currentFile, 'utils/dep');

            assert.equal(result, '../dep');
        });

        it('with absolute filename', () => {
            const currentFile = path.join(process.env.PWD, './utils/test/file.js');
            const result = mapToRelative(currentFile, 'utils/dep');

            assert.equal(result, '../dep');
        });
    });
});
