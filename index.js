'use strict';

module.exports = generator;

var fs = require('fs');
var fse = require('fs-extra');
var node_path = require('path');
var async = require('async');
var ejs = require('ejs');

// Use '{%' which is more friendly to README.md instead of '<%' 
ejs.open = '{%';
ejs.close = '%}';

var clone = require('clone');
var scaffold = require('scaffold-generator');


// @param {Object} options
// - template {string='default'} template name
// - override
function generator(pkg, options, callback) {
  var template = options.template || 'default';
  var license = options.license || 'MIT';

  var cloned_pkg = generator._pkgData(pkg);

  if (!~generator.AVAILABLE_TEMPLATES.indexOf(template)) {
    return callback(new Error('Invalid template'));
  }

  if (!~generator.AVAILABLE_LICENSES.indexOf(license)) {
    return callback(new Error('Invalid license'));
  }

  var s = scaffold({
    data: cloned_pkg,
    override: options.override
  });

  async.parallel([
    // copy template
    function (done) {
      var template_root = node_path.join(__dirname, 'templates', template);
      s.copy(template_root, options.cwd, done);
    },

    // copy licenses
    function (done) {
      var file = node_path.join(__dirname, 'licenses', 'LICENSE-' + license);
      s.copy(file, options.cwd, done);
    },

    // write cortex.json
    function (done) {
      var cortex_json = node_path.join(options.cwd, 'cortex.json');
      var content = JSON.stringify(pkg, null, 2); //format
      s.write(cortex_json, content, done);
    }

  ], callback);
};


generator._pkgData = function (pkg) {
  pkg = clone(pkg);

  // `cortex-init-prompts` ensures that `name` is
  // - starts with a letter
  // - only contains letters, numbers, `-` and `.` 
  var safe_javascript_name = pkg.name.replace(/[-\.]/g, '_');

  pkg.js_name = safe_javascript_name;

  pkg.main_in_test = 
    // Relative to test files, pkg.main is outside the current folder
    node_path.join('..', pkg.main)
    // Removes ending `.js`
    // TODO: related to kaelzhang/node-commonjs-walker#10
    .replace(/\.js$/, '');

  return pkg;
};


generator.AVAILABLE_TEMPLATES = [
  'default'
];

generator.AVAILABLE_LICENSES = [
  'MIT',
  'Apache-2.0',
  'GPL-2.0',
  'MPL-2.0'
];

generator.availableLicenses = function() {
  return [].concat(generator.AVAILABLE_LICENSES);
};

generator.availableTemplates = function () {
  return [].concat(generator.AVAILABLE_TEMPLATES);
};
