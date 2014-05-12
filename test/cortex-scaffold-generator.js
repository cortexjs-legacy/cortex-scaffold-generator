'use strict';

var expect = require('chai').expect;
var generator = require('../');
var fs = require('fs');
var jf = require('jsonfile');

describe( 'generator(pkg, opts, callback)', function () {
  it('should copy all files in the directory, including subdirectories',
    function ( done ) {
      var pkg = jf.readFileSync('test/fixtures/cortex.json');
      var opts = { 
        template: generator.AVAILABLE_TEMPLATES[0],
        cwd     : 'test/expected'
      };

      generator( pkg, opts, function (err) {
        var expected = fs.readFileSync('test/expected/index.js','utf-8');
        expect(expected).not.to.be.null;
        done();
      });
    }
  );
});
