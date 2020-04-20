

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'BabelTransform2', {
  enumerable: true,
  get: function() {
    return _transform.BabelTransform2;
  },
});
Object.defineProperty(exports, 'BabelStore2', {
  enumerable: true,
  get: function() {
    return _store.BabelStore2;
  },
});
Object.defineProperty(exports, 'SubHeader2', {
  enumerable: true,
  get: function() {
    return _SubHeader.SubHeader2;
  },
});
Object.defineProperty(exports, 'test2', {
  enumerable: true,
  get: function() {
    return _test.test2;
  },
});
Object.defineProperty(exports, 'Utils2', {
  enumerable: true,
  get: function() {
    return _utils.Utils2;
  },
});
Object.defineProperty(exports, 'empty2', {
  enumerable: true,
  get: function() {
    return _.empty2;
  },
});
exports.something = void 0;

var _transform = require('@babel/core/lib/transform');

var _store = require('babel-core/lib/store');

var _SubHeader = require('../../testproject/src/components/Header/SubHeader');

var _test = require('../../testproject/test');

var _utils = require('./utils');

var _ = require('');

// should only apply the alias once
// @babel/core/transform should becore @babel/core/lib/transform, not @babel/core/lib/lib/transform
// should resolve the path based on the root config
// should alias the path
// should not change a relative path
// should handle an empty path
// should resolve the path based on the root config
let something;
exports.something = something;
