# {%= name %}

> {%= description %}

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

#### Install Node

Visit [http://nodejs.org](http://nodejs.org), download and install the proper version of nodejs.

#### Install Cortex

    # maybe you should use `sudo`
    npm install -g cortex

## Using {%= name %} In Your Project

First, install '{%= name %}' directly with `cortex install` (recommended)

	cortex install {%= name %} --save

or, you could update your package.json manually

    dependencies: {
        '{%= name %}': '<version-you-want>'
    }

and install dependencies

	cortex install

Then, use `require` method in your module

    var {%= name %} = require('{%= name %}');

Finally, start cortex server

    cortex server

Then cortex will care all the rest.


## API Documentation

### {%= name %}: constructor
': constructor' means the `module.exports` of module '{%= name %}' is a constructor that we should use it with the `new` keyword

	new {%= name %}(options)

#### options
- options.name {String}



### {%= name %}.\<method-name\>(arguments)
Means this is a static method of `module.exports`

#### arguments
// arguments description here

### .\<method-name\>(arguments)
Mean this is a method of the instance

#### arguments
// arguments description here