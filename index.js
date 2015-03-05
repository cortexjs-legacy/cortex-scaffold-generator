'use strict';

module.exports = generator;

var fs = require('fs');
var fse = require('fs-extra');
var node_path = require('path');
var async = require('async');
var ejs = require('ejs-harmony');
var stringify = require('json-stringify');
var home = require('home')
ejs.filters.json = function (obj, offset) {
  return stringify(obj || {}, {
    offset: offset
  });
};

// Use '{%' which is more friendly to README.md instead of '<%'
var OPEN = '{%';
var CLOSE = '%}';

var clone = require('clone');
var scaffold = require('scaffold-generator');

var DIR_CUSTOM_TEMPLATES = home.resolve("~/.cortex/templates");

// @param {Object} options
// - template {string='default'} template name
// - override
function generator(pkg, options, callback) {
  var template = options.template || 'default';
  var license = options.license || 'MIT';

  var cloned_pkg = generator._pkgData(pkg);
  cloned_pkg.neuron_version = options.neuron_version;

  if (!~generator.availableTemplates().indexOf(template)) {
    return callback(new Error('Invalid template'));
  }

  if (!~generator.availableLicenses().indexOf(license)) {
    return callback(new Error('Invalid license'));
  }

  var s = scaffold({
    data: cloned_pkg,
    override: options.override,
    renderer: {
      render: function (str, data) {
        // `ejs` confuse data with options, but there is no way out.
        // Dame it!
        data.open = OPEN;
        data.close = CLOSE;
        return ejs.render(str, data);
      }
    }
  });
  var template_root;

  function write_if_not_exists (file, data, done) {
    var template_file = node_path.join(template_root, file);
    fs.exists(template_file, function (exists) {
      if (exists) {
        return done(null);
      }
      var to = node_path.join(options.cwd, file);
      s.write(to, data, done);
    });
  }


  async.series([
    // set template root
    function (done) {
      var root = node_path.join(__dirname, 'templates', template);

      fs.exists(root, function(exists){
        if(exists){
          template_root = root;
        }else{
          template_root = node_path.join(DIR_CUSTOM_TEMPLATES, template)
        }
        done(null);
      });
    },

    // copy template
    function (done) {
      s.copy(template_root, options.cwd, done);
    },

    // copy licenses
    function (done) {
      var file = node_path.join(__dirname, 'licenses', 'LICENSE-' + license);
      s.copy(file, options.cwd, done);
    },

    // write cortex.json
    function (done) {
      var content = JSON.stringify(pkg, null, 2);
      write_if_not_exists('cortex.json', content, done);
    },

    // write package.json
    function (done) {
      var p = clone(pkg);
      delete p.devDependencies;
      var content = JSON.stringify(p, null, 2);
      write_if_not_exists('package.json', content, done);
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

  // npm will rename .gitignore to .npmignore:
  // [ref](https://github.com/npm/npm/issues/1862)
  pkg.gitignore = '.gitignore';

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
  var options = [];
  if(fs.existsSync(DIR_CUSTOM_TEMPLATES)){
    options = fs.readdirSync(DIR_CUSTOM_TEMPLATES).filter(function(dirname){
      return dirname.indexOf(".") != 0;
    });
  }
  return generator.AVAILABLE_TEMPLATES.concat(options);
};