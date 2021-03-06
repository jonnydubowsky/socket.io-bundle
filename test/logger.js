var expect = require('chai').expect;
var bundle = require('../');
var support = require('./support');
var client = support.client;


function MockStream() {
  this.data = [];
}

MockStream.prototype.write = function(str) {
  this.data.push(str);
};

/**
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 */

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

function formatToRegExp(format) {
  var re = escapeRegExp(format).replace(/\\:[a-z-]+(\\\[[a-z-]+\\\])?/g, '(.+)');
  return new RegExp(re);
}

describe('logger', function() {
  beforeEach(function(done) {
    support.startServer(this, done);
  });

  afterEach(function(done) {
    support.stopServer(this, done);
  });

  it('should write a log on connection', function(done) {
    var stream = new MockStream();
    this.io.use(bundle.logger({stream: stream}));
    this.io.on('connection', function(socket) {
      expect(stream.data.length).to.eql(1);
      expect(stream.data[0]).to.match(formatToRegExp(bundle.logger.default));
      done();
    });
    client();
  });
});


