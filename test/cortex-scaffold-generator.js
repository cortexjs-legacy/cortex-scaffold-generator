'use strict';

var expect = require('chai').expect;
var generator = require('../');
var fs = require('fs');
var fse = require('fs-extra');
var tmp = require('tmp-sync');
var node_path = require('path');
var jf = require('jsonfile');

var pkg = node_path.join(__dirname, 'fixtures', 'package.json');
pkg = jf.readFileSync(pkg);


var cases = [
  {
    // desc
    d: 'cortex.json file',
    // setup
    // s: function (to) {
      
    // },
    // expect
    e: function (to) {
      var file = node_path.join(to, 'cortex.json');
      var exists = fs.existsSync(file);
      expect(exists).to.equal(true);
    }
  },
  {
    d: 'rename files',
    e: function (to) {
      expect(fs.existsSync(node_path.join(to, 'lib', 'blah.js'))).to.equal(true);
    }
  },
  {
    d: 'test override',
    s: function (to) {
      var file = node_path.join(to, 'cortex.json');
      fs.writeFileSync(file, 'abc');
    },
    o: {

    },
    e: function (to) {
      var file = node_path.join(to, 'cortex.json');
      expect( fs.readFileSync(file).toString() ).to.equal('abc');
    }
  },
  {
    d: 'test .gitignore file',
    e: function (to) {
      var file = node_path.join(to, '.gitignore');
      expect( fs.existsSync(file) ).to.equal(true);
    }
  },
  {
    d: 'no neuron version',
    o: {
      neuron_version: '5.0.0'
    },
    e: function (to) {
      var index = node_path.join(to, 'index.html');
      expect( fs.readFileSync(index).toString() ).to.contain('neuron.js');
    }
  }
];

describe( 'generator(pkg, options, callback)', function (done) {
  cases.forEach(function (c) {
    var to = tmp.in(__dirname);
    c.s && c.s(to);
    it(c.d, function(done){
      var options = c.o || {};
      options.cwd = to;
      generator(pkg, options, function (err) {
        c.e(to);
        done();
      });
    });
  });
});


describe( 'generator.availableLicenses()', function () {
  it( 'should return available licences array', function ( done ) {
    expect( generator.availableLicenses() ).to.be.a( 'array' );
    done();
  });
});

describe( 'generator.availableTemplates', function () {
  it( 'should return available templates array', function ( done ) {
    expect(generator.availableTemplates() ).to.be.a( 'array' );
    done();
  });
});
