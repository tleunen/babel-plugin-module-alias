// should resolve the path based on the root config
require('components/Header/SubHeader');

require.resolve('components/Header/SubHeader');
System.import('components/Header/SubHeader');
jest.genMockFromModule('components/Header/SubHeader');
jest.mock('components/Header/SubHeader');
jest.unmock('components/Header/SubHeader');
jest.doMock('components/Header/SubHeader');
jest.dontMock('components/Header/SubHeader');
jest.setMock('components/Header/SubHeader');
require.requireActual('components/Header/SubHeader');
require.requireMock('components/Header/SubHeader');
customMethod.something('components/Header/SubHeader');

// should alias the path
require('test');

require.resolve('test');
System.import('test');
jest.genMockFromModule('test');
jest.mock('test');
jest.unmock('test');
jest.doMock('test');
jest.dontMock('test');
jest.setMock('test');
require.requireActual('test');
require.requireMock('test');
customMethod.something('test');

// should not change a relative path
require('./utils');

require.resolve('./utils');
System.import('./utils');
jest.genMockFromModule('./utils');
jest.mock('./utils');
jest.unmock('./utils');
jest.doMock('./utils');
jest.dontMock('./utils');
jest.setMock('./utils');
require.requireActual('./utils');
require.requireMock('./utils');
customMethod.something('./utils');

// should handle no arguments
require();
require.resolve();
System.import();
jest.genMockFromModule();
jest.mock();
jest.unmock();
jest.doMock();
jest.dontMock();
jest.setMock();
require.requireActual();
require.requireMock();
customMethod.something();

// should handle the first argument not being a string literal
require(path);
require.resolve(path);
System.import(path);
jest.genMockFromModule(path);
jest.mock(path);
jest.unmock(path);
jest.doMock(path);
jest.dontMock(path);
jest.setMock(path);
require.requireActual(path);
require.requireMock(path);
customMethod.something(path);

// should handle an empty path
require('');

require.resolve('');
System.import('');
jest.genMockFromModule('');
jest.mock('');
jest.unmock('');
jest.doMock('');
jest.dontMock('');
jest.setMock('');
require.requireActual('');
require.requireMock('');
customMethod.something('');

// should ignore the call if the method name is not fully matched (suffix)
require.after('components/Sidebar/Footer');
require.resolve.after('components/Sidebar/Footer');
System.import.after('components/Sidebar/Footer');
jest.genMockFromModule.after('components/Sidebar/Footer');
jest.mock.after('components/Sidebar/Footer');
jest.unmock.after('components/Sidebar/Footer');
jest.doMock.after('components/Sidebar/Footer');
jest.dontMock.after('components/Sidebar/Footer');
jest.setMock.after('components/Sidebar/Footer');
require.requireActual.after('components/Sidebar/Footer');
require.requireMock.after('components/Sidebar/Footer');
customMethod.something.after('components/Sidebar/Footer');

// should ignore the call if the method name is not fully matched (prefix)
before.require('components/Sidebar/Footer');
before.require.resolve('components/Sidebar/Footer');
before.System.import('components/Sidebar/Footer');
before.jest.genMockFromModule('components/Sidebar/Footer');
before.jest.mock('components/Sidebar/Footer');
before.jest.unmock('components/Sidebar/Footer');
before.jest.doMock('components/Sidebar/Footer');
before.jest.dontMock('components/Sidebar/Footer');
before.jest.setMock('components/Sidebar/Footer');
before.require.requireActual('components/Sidebar/Footer');
before.require.requireMock('components/Sidebar/Footer');
before.customMethod.something('components/Sidebar/Footer');

// should resolve the path if the method name is a string literal
require.resolve('components/Sidebar/Footer');
customMethod.something('components/Sidebar/Footer');

// should ignore the call if the method name is unknown
unknownFn('components/Sidebar/Footer');
