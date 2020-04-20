module.exports = function fakePlugin(opts) {
  return {
    name: 'fake-plugin',
    visitor: {
      Identifier(path) {
        if (path.node.name === 'bootest') {
          path.replaceWith(opts.types.Import());
        }
      },
    },
  };
};
