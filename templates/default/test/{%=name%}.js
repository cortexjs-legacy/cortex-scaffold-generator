'use strict';

var {%= js_name %} = require('./index');
var assert = require('assert');

describe("description", function(){
  it("should has a method `my_method`", function(){
    assert.equal('my_method' in {%= js_name %}, true);
  });
});