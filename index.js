'use strict';

module.exports = generator;

var fs = require('fs');
var fse = require('fs-extra');
var node_path = require('path');
var async = require('async');
var glob = require('glob');
var ejs = require('ejs');
ejs.open = '{%';
ejs.close = '%}';


// @param {Object} options
// - template {string='default'} template name
// - override
function generator(pkg, options, callback) {
  var template = options.template || 'default';
  var license = options.license || 'MIT';

  if (!~generator.AVAILABLE_TEMPLATES.indexOf(template)) {
    return callback(new Error('Invalid template'));
  }

  if (!~generator.AVAILABLE_LICENSES.indexOf(license)) {
    return callback(new Error('Invalid license'));
  }

  async.parallel([
    // copy template
    function (done) {
      var template_root = node_path.join(__dirname, 'templates', template);
      generator._globDir(template_root, function (err, files) {
        if (err) {
          return callback(err);
        }

        generator._copyFiles(files, {
          from: template_root,
          to: options.cwd,
          data: pkg,
          override: options.override
        }, callback);
      });
    },

    // copy licenses
    function (done) {
      var file = 'LICENSE-' + license;
      generator._copyFile(file, {
        from: node_path.join(__dirname, 'licenses'),
        to: options.cwd,
        data: pkg,
        override: options.override
      }, callback)
    }

  ], callback);
};


// @param {Array} files relative files
// @param {Object} options
// - from {path}
// - to {path}
// - data {Object}
// - override 
generator._copyFiles = function(files, options, callback) {
  async.each(files, function (file, done) {
    generator._copyFile(file, options, done);
  }, callback);
};


// Params same as `_copyFiles`
generator._copyFile = function (file, options, callback) {
  var file_to = node_path.join(options.to, file);
  var file_from = node_path.join(options.from, file);

  generator._shouldOverride(file_to, options.override, function (override) {
    if (!override) {
      return callback(null);
    }

    generator._readAndTemplate(from, options.data, function (err, content) {
      if (err) {
        return callback(err);
      }

      fse.outputFile(to, content, callback);
    });
  });
};


generator._shouldOverride = function (to, override, callback) {
  if (override) {
    return callback(true);
  }

  fs.exists(to, function (exists) {
    if (exists) {
      return done(false);
    }

    callback(true);
  });
};


// Reads file and substitute with the data
generator._readAndTemplate = function (path, data, callback) {
  fs.readFile(path, function (err, content) {
    if (err) {
      return callback(err);
    }

    content = ejs.render(content.toString(), data);
    callback(null, content);
  });
};


var REGEX_FILE = /[^\/]$/;
generator._globDir = function (root, callback) {
  glob('**/*', {
    cwd: root,
    // Then, the dirs in `files` will end with a slash `/`
    mark: true
  }, function (err, files) {
    if (err) {
      return callback(err);
    }

    files = files.filter(REGEX_FILE.test, REGEX_FILE)
    callback(null, files);
  });
};


generator.AVAILABLE_TEMPLATES = [
  'default'
];

generator.AVAILABLE_LICENSES = [
  'Apache-2.0',
  'GPL-2.0',
  'MIT',
  'MPL-2.0'
];

generator.availableLicenses = function() {
  return [].concat(generator.AVAILABLE_LICENSES);
};

generator.availableTemplates = function () {
  return [].concat(generator.AVAILABLE_TEMPLATES);
};
