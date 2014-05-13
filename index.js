'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through');
var async = require('async');
var template = require('ejs');
var jf = require('jsonfile');
var stat = fs.stat;
template.open = '{%';
template.close = '%}';
    
//Copy all files in the directory, including subdirectories
var copy = function ( pkg, opts, done ) {
  var src = opts.src;
  var dst = opts.dst;

  fs.readdir( src, function ( err, fileNames ) {
    if( err ) {
      return done( err );
    }
    async.each( fileNames, function ( fileName, callback ) {
      var _src = path.join( src, fileName );
      var _dst = fileName == 'name.js' 
        ? path.join( dst, pkg.name + '.js' ) 
        : path.join( dst, fileName );

      stat( _src, function ( err, st ) {
        if( err ) {
          return callback( err );
        }
        if( st.isFile() ) {
          fs.exists( _dst, function ( exists ) {
            //override or not
            if( !exists || opts.override ) {
              doCopy( pkg, _src, _dst, callback );
            } else {
              callback();
            }
          });
        } else if( st.isDirectory() ) {
          exists( pkg, {
            src     : _src,  
            dst     : _dst,
            override: opts.override
          }, callback );
        } else {
          callback();
        }
      });
    }, function (err) {
      writePackageJson( pkg, opts, function (err) {
        done( err );
      });
    });
  });
};

var doCopy = function ( pkg, src, dst, callback ) {
  var readable = fs.createReadStream( src );
  var writable = fs.createWriteStream( dst );
  writable.on( 'finish', function () {
    callback();
  });
  readable.pipe( through( function (buf) {
    this.queue( template.render( buf.toString(), pkg ) );
  })).pipe( writable );
};

var writePackageJson = function ( pkg, opts, done ) {
  var packageJsonPath = path.join( opts.dst, 'package.json' );
  fs.exists( packageJsonPath, function ( exists ) {
    if( exists && !opts.override ) {
      jf.readFile( packageJsonPath, function ( err, obj ) {
        if( err ) {
          return done( err );
        }
        obj.cortex = {
          "devDependencies": {
            "neuron": "*"
          },
          "asyncDependencies": {},
          "scripts": {},
          "dependencies": {}
        };
        jf.writeFile( packageJsonPath, obj, function ( err ) {
          done( err );
        })
      });
    } else {
      var obj = {
        engines: {
          node: ">=0.8.0"
        }
      };
      var props = ['name', 'description', 'version', 'repository', 'homepage', 'bugs', 'author'];
      async.each( props, function ( prop, callback ) {
        obj[prop] = pkg[prop];
        callback();
      }, function ( err ) {
        jf.writeFile( packageJsonPath, obj, function ( err ) {
          done( err );
        })
      });
    }
  });
}

// Before copying directories need to determine that the directory exists or not.
// If the directory does not exist, need to create a directory
var exists = function( pkg, opts, callback ) {
  fs.exists( opts.dst, function ( exists ) {
    if( exists ) {
      copy( pkg, opts, callback );
    } else {
      fs.mkdir( opts.dst, function () {
        copy( pkg, opts, callback );
      });
    }
  });
};

var generator = function ( pkg, opts, callback ) {

  var default_opts = {
    template: 'default',
    override: false 
  }

  if ( pkg == null ) {
    var err = new Error( '\'pkg\' must be an object.' );
    return callback( err );
  }

  if ( pkg.name == null ) {
    var err = new Error( 'Missing \'pkg.name\'.' );
    return callback( err );
  }

  if ( opts == null ) {
    var err = new Error( '\'opts\' must be an object.' );
    return callback( err );
  }

  if ( opts.cwd == null ) {
    var err = new Error( 'Missing options \'cwd\'.' );
    return callback( err );
  }

  if ( opts.template == null ) {
    opts.template = default_opts.template;
  }

  if ( opts.override == null ) {
    opts.override = default_opts.override;
  }

  callback = callback || function () {};

  exists( pkg, {
    src     : path.join( '.', 'templates', opts.template ),  
    dst     : opts.cwd,
    override: opts.override
  }, callback );  
};

generator.AVAILABLE_TEMPLATES = ['default'];

generator.availableLicences = function () {
  var AVAILABLE_LICENCES = ['MIT'];
  return AVAILABLE_LICENCES;
};

module.exports = generator;