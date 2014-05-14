'use strict';

var expect = require('chai').expect;
var generator = require('../');
var fs = require('fs');
var jf = require('jsonfile');

describe( 'generator(pkg, opts, callback)', function () {
  it( 'should generator files with pkg and opts',
    function ( done ) {
      var pkg = jf.readFileSync( 'test/fixtures/cortex1.json' );
      var opts = { 
        template: generator.availableTemplates()[0],
        cwd     : 'test/expected'
      };

      generator( pkg, opts, function ( err ) {
        var expected = fs.readFileSync( 'test/expected/index.js','utf-8' );
        expect( expected ).not.to.be.null;
        done();
      });
    }
  );

  it( 'should override files when opts.override is true',
    function ( done ) {
      var pkg = jf.readFileSync( 'test/fixtures/cortex2.json' );
      var opts = { 
        template: generator.availableTemplates()[0],
        cwd     : 'test/expected',
        override: true
      };

      generator( pkg, opts, function ( err ) {
        var genPkg = jf.readFileSync( 'test/expected/package.json' );
        expect( genPkg.name ).to.equal( pkg.name );
        done();
      });
    }
  );

  it( 'should only add cortex config in package.json when opts.override is false',
    function ( done ) {
      var packageJsonFile = fs.readFileSync( 'test/fixtures/package.json' );
      fs.writeFileSync( 'test/expected/package.json', packageJsonFile );

      var pkg = jf.readFileSync( 'test/fixtures/cortex2.json' );
      var opts = {
        template: generator.availableTemplates()[0],
        cwd     : 'test/expected',
        override: false
      };

      generator( pkg, opts, function (err) {
        var genPkg = jf.readFileSync( 'test/expected/package.json' );
        expect( genPkg.cortex ).not.to.be.null;
        done();
      });
    }
  );

  describe( '#availableLicenses()', function () {
    it( 'should return available licences array', function ( done ) {
      expect( generator.availableLicenses() ).to.be.a( 'array' );
      done();
    });
  });

  describe( '#availableTemplates', function () {
    it( 'should return available templates array', function ( done ) {
      expect(generator.availableTemplates() ).to.be.a( 'array' );
      done();
    });
  });
});
