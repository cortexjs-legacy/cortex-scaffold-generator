'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through');
var stat = fs.stat;
var allNum = 0; 
    
//Copy all files in the directory, including subdirectories
var copy = function ( name, src, dst, callback ) {
  fs.readdir( src, function ( err, paths ) {
    if( err ) {
      throw err;
    }

    allNum += paths.length;

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
          readable = fs.createReadStream( _src );
          writable = fs.createWriteStream( _dst );

          //When all files were copied, run the 'callback' function.
          writable.on( 'finish', function () {
          	fileNum--;
          	allNum--;
          	if( fileNum === 0 ) {
          	  allNum -= 1;
          	}
          	if( allNum === 0 ) {
          	  callback();
          	}
		  });
          readable.pipe( through( function (buf) {
            this.queue( buf.toString().replace( /\{%= name %\}/g, name ) );
          })).pipe( writable );
        } else if( st.isDirectory() ) {
          
          exists( name, _src, _dst, callback );
        }
      });
    });
  });
};

// Before copying directories need to determine that the directory exists or not.
// If the directory does not exist, need to create a directory
var exists = function( name, src, dst, callback ) {
  fs.exists( dst, function ( exists ) {
    if( exists ) {
      copy( name, src, dst, callback );
    } else {
      fs.mkdir( dst, function () {
        copy( name, src, dst, callback );
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

  if (!opts.cwd) {
  	throw new Error('Missing options \'cwd\'');
  }

  exists( pkg.name, path.join('./templates', opts.template), opts.cwd, callback );  
}

module.exports = new Generator();