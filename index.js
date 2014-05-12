'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through');
var async = require('async');
var stat = fs.stat;
    
//Copy all files in the directory, including subdirectories
var copy = function ( name, opts, done ) {
  var src = opts.src;
  var dst = opts.dst;

  fs.readdir( src, function ( err, paths ) {
    if( err ) {
      return done(err);
    }
    async.each( paths, function ( path, callback ) {
      var _src = src + '/' + path;
      var _dst = path == 'name.js' ? dst + '/' + name + '.js' : dst + '/' + path;

      stat( _src, function ( err, st ) {
        if( err ){
          return callback(err);
        }
        if( st.isFile() ) {
          fs.exists( _dst, function ( exists ) {
            //override or not
            if( !exists || opts.override ) {
              doCopy( name, _src, _dst, callback );
            } else {
              callback();
            }
          });
        } else if( st.isDirectory() ) {
          exists( name, {
            src     : _src,  
            dst     : _dst,
            override: opts.override
          }, done );
          callback();
        } else {
          callback();
        }
      });
    }, function (err) {
      done(err);
    });
  });
};

var doCopy = function ( name, src, dst, callback ) {
  var readable = fs.createReadStream( src );
  var writable = fs.createWriteStream( dst );
  writable.on( 'finish', function () {
    callback();
  });
  readable.pipe( through( function (buf) {
    this.queue( buf.toString().replace( /\{%= name %\}/g, name ) );
  })).pipe( writable );
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

var generator = function ( pkg, opts, callback ) {

  var default_opts = {
    template: 'default',
    override: false 
  }

  if ( pkg == null ) {
    var err = new Error( '\'pkg\' must be an object.' );
    return callback(err);
  }

  if ( pkg.name == null ) {
    var err = new Error( 'Missing \'pkg.name\'.' );
    return callback(err);
  }

  if ( opts == null ) {
    var err = new Error( '\'opts\' must be an object.' );
    return callback(err);
  }

  if ( opts.cwd == null ) {
    var err = new Error( 'Missing options \'cwd\'.' );
    return callback(err);
  }

  if ( opts.template == null ) {
    opts.template = default_opts.template;
  }

  if ( opts.override == null ) {
    opts.override = default_opts.override;
  }

  callback = callback || function () {};

  exists( pkg.name, {
    src     : path.join( './templates', opts.template ),  
    dst     : opts.cwd,
    override: opts.override
  }, callback );  
};

generator.AVAILABLE_TEMPLATES = ['default'];

module.exports = generator;