'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through');

var Generator = function () {};

Generator.DEFAULT = 'default';

Generator.prototype.generator = function (pkg, opts, callback) {
  var self = this;
  var default_opts = {
  	template: self.DEFAULT,
    override: false 
  }
  var pkg = pkg;

  this.pkg = pkg;
  this.opts = opts;

  fs.createReadStream(path.join('/', self.opts.template))
	.pipe(through(function (buf) {
	  this.queue(buf.toString().repalce(/\{%= name %\}/g, self.pkg.name));
	}))
    .pipe(fs.createWriteStream(self.opts.cwd));
}

module.exports = generator;