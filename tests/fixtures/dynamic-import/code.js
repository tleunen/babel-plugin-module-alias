// According to https://github.com/tc39/proposal-dynamic-import
// Currently stage 3.

// should resolve the path based on the root config
import('components/Header/SubHeader')
  .then(() => {})
  .catch(() => {});

// should alias the path
import('test')
  .then(() => {})
  .catch(() => {});

// should not change a relative path
import('./utils')
  .then(() => {})
  .catch(() => {});

// should handle the first argument not being a string literal
import(path)
  .then(() => {})
  .catch(() => {});

// should handle an empty path
import('')
  .then(() => {})
  .catch(() => {});
