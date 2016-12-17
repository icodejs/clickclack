import chai from 'chai';
import sinonChai from 'sinon-chai';

// setup chai
chai.use(sinonChai);
chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

// setup jsdom globals for mocha
if (!global.document) {
  const jsdom = require('jsdom').jsdom;
  const exposedProperties = ['window', 'document'];

  global.document = jsdom('');
  global.window = document.defaultView;

  Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
      exposedProperties.push(property);
      global[property] = document.defaultView[property];
    }
  });

  global.navigator = {
    userAgent: 'node.js'
  };
}
