'use strict';

var {%= js_name %} = require('{%= main_in_test %}');
var assert = require('assert');

describe("description", function(){
  it("should has a method `my_method`", function(){
    assert.ok('my_method' in {%= js_name %});
  });
});