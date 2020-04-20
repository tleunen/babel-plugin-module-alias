// should only apply the alias once
// @babel/core/transform should becore @babel/core/lib/transform, not @babel/core/lib/lib/transform
import ImportedBabelTransform from '@babel/core/lib/transform';
import ImportedBabelStore2 from 'babel-core/lib/store'; // should resolve the path based on the root config

import SubHeader from '../../testproject/src/components/Header/SubHeader'; // should alias the path

import test from '../../testproject/test'; // should not change a relative path

import Utils from './utils'; // should handle an empty path

import empty from ''; // should resolve the path based on the root config

export { SubHeader2 } from '../../testproject/src/components/Header/SubHeader';
let something;
export { something }; // should alias the path

export { test2 } from '../../testproject/test'; // should not change a relative path

export { Utils2 } from './utils'; // should handle an empty path

export { empty2 } from ''; // should only apply the alias once
// @babel/core/transform should becore @babel/core/lib/transform, not @babel/core/lib/lib/transform

export { ExportedBabelTransform } from '@babel/core/lib/transform';
export { ExportedBabelStore2 } from 'babel-core/lib/store';
