'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through');
var stat = fs.stat;
    
//Copy all files in the directory, including subdirectories
var copy = function ( src, dst, callback ) {
  fs.readdir( src, function ( err, paths ) {
    if( err ) {
      throw err;
    }

    paths.forEach( function ( path ) {
      var _src = src + '/' + path;
      var _dst = dst + '/' + path;
      var readable;
      var writable;        

      stat( _src, function ( err, st ) {
        if( err ){
          throw err;
        }

        if( st.isFile() ) {
          readable = fs.createReadStream( _src );
          writable = fs.createWriteStream( _dst );
          writable.on('finish', function () {
		    callback();
		  });
          readable.pipe( through( function (buf) {
            	this.queue( buf.toString().replace( /\{%= name %\}/g, pkg.name ) );
          })).pipe( writable );
        } else if( st.isDirectory() ) {
          exists( _src, _dst, copy );
        }
      });
    });
  });
};

// Before copying directories need to determine that the directory exists or not.
// If the directory does not exist, need to create a directory
var exists = function( src, dst, callback ) {
  fs.exists( dst, function ( exists ) {
    if( exists ) {
      callback( src, dst );
    } else {
      fs.mkdir( dst, function () {
        callback( src, dst );
      });
    }
  });
};

var Generator = function () {};

Generator.DEFAULT = 'default';

Generator.prototype.generator = function (pkg, opts, callback) {
  var default_opts = {
  	template: self.DEFAULT,
    override: false 
  }

  if (!opts.cwd) {
  	throw new Error('Missing options \'cwd\'');
  }

  exists( path.join('/', opts.template), opts.cwd, copy );  
}

module.exports = generator;