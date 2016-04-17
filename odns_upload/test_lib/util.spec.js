'use strict';

var _chai = require('chai');

var _index = require('../src/index');

describe('util', function () {
  it('should return object contains foo', function () {
    var foo = 'foo';
    (0, _chai.expect)((0, _index.util)(foo)).to.be.deep.equal({ foo: foo });
  });
});
//# sourceMappingURL=util.spec.js.map