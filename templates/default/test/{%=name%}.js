'use strict';

var {%= js_name %} = require('{%= main_in_test %}');

// To know the usage of `assert`, see: http://nodejs.org/api/assert.html
var assert = require('assert');

describe("description", function(){
  it("should has a method `init`", function(){
    assert.ok('init' in {%= js_name %});
  });
});