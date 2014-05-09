'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through');
var stat = fs.stat;
var totalNum = 0;

//When all files were copied, run the 'callback' function.
var done = function ( fileNum, callback ) {
  fileNum--;
  totalNum--;

  if( fileNum === 0 ) {
	totalNum--;
  }
  if( totalNum === 0 ) {
	callback();
  }
}
    
//Copy all files in the directory, including subdirectories
var copy = function ( name, opts, callback ) {
  var src = opts.src;
  var dst = opts.dst;

  fs.readdir( src, function ( err, paths ) {
    if( err ) {
      throw err;
    }

    totalNum += paths.length;

    paths.forEach( function ( path ) {
      var _src = src + '/' + path;
      var _dst = path == 'name.js' ? dst + '/' + name + '.js' : dst + '/' + path;
      var readable;
      var writable;        

      stat( _src, function ( err, st ) {
        if( err ){
          throw err;
        }

        var fileNum = 0;

        if( st.isFile() ) {
          fileNum++;
          fs.exists( _dst, function ( exists ) {
          	if( !exists || opts.override ) {
	          readable = fs.createReadStream( _src );
	          writable = fs.createWriteStream( _dst );
	          writable.on( 'finish', function () {
	          	done(fileNum, callback);
			  });
	          readable.pipe( through( function (buf) {
	            this.queue( buf.toString().replace( /\{%= name %\}/g, name ) );
	          })).pipe( writable );
          	} else {
          	  done(fileNum, callback);
          	}
          });
        } else if( st.isDirectory() ) {
          exists( name, {
  	        src     : _src,  
  		    dst     : _dst,
  		    override: opts.override
  	      }, callback );
        }
      });
    });
  });
};

// Before copying directories need to determine that the directory exists or not.
// If the directory does not exist, need to create a directory
var exists = function( name, opts, callback ) {
  fs.exists( opts.dst, function ( exists ) {
    if( exists ) {
      copy( name, opts, callback );
    } else {
      fs.mkdir( opts.dst, function () {
        copy( name, opts, callback );
      });
    }
  });
};

var Generator = function () {
  this.DEFAULT = 'default';
};

Generator.prototype.generator = function (pkg, opts, callback) {
  var default_opts = {
  	template: this.DEFAULT,
    override: false 
  }

  if ( typeof(pkg) !== 'object') {
  	throw new Error( '\'pkg\' must be an object.' );
  }

  if ( !pkg.name ) {
  	throw new Error( 'Missing \'pkg.name\'.' );
  }

  if ( typeof(opts) !== 'object') {
  	throw new Error( '\'opts\' must be an object.' );
  }

  if ( !opts.cwd ) {
  	throw new Error( 'Missing options \'cwd\'.' );
  }

  if ( !opts.template ) {
  	opts.template = default_opts.template;
  }

  if ( typeof(opts.override) === 'undefined' ) {
  	opts.override = default_opts.override;
  }

  callback = callback || function () {};

  exists( pkg.name, {
  	src     : path.join( './templates', opts.template ),  
  	dst     : opts.cwd,
  	override: opts.override
  }, callback );  
}

module.exports = new Generator();