'use strict';

var expect = require('chai').expect;
var Generator = require('../');
var fs = require('fs');
var jf = require('jsonfile');

describe( 'Generator', function () {
  it('should has property DEFAULT', function ( done ) {
    expect(Generator.DEFAULT).to.be.a('string');
    done();
  });

  describe( '#generator(pkg, opts, callback)', function () {
    it('should copy all files in the directory, including subdirectories',
  	  function ( done ) {
        var pkg = jf.readFileSync('test/cortex.json');
        var opts = { 
          template: Generator.DEFAULT,
          cwd     : 'test/expected'
        };

        Generator.generator( pkg, opts, function (err) {
      	  var expected = fs.readFileSync('test/expected/index.js','utf-8');
          expect(expected).not.to.be.null;
          done();
        });
      }
    );
  });
});
