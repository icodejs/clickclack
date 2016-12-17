import chai from 'chai';
import sinonChai from 'sinon-chai';

// setup chai
chai.use(sinonChai);
chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
