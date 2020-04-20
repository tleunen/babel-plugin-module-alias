import path from 'path';
import pluginTester from 'babel-plugin-tester';
import moduleResolverPlugin from '../src';

pluginTester({
  plugin: moduleResolverPlugin,
  fixtures: path.join(__dirname, 'fixtures'),
  filename: __filename,
  snapshot: true,
});
