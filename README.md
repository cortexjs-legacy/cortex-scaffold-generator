# cortex-scaffold-generator [![NPM version](https://badge.fury.io/js/cortex-scaffold-generator.svg)](http://badge.fury.io/js/cortex-scaffold-generator) [![Build Status](https://travis-ci.org/cortexjs/cortex-scaffold-generator.svg?branch=master)](https://travis-ci.org/cortexjs/cortex-scaffold-generator) [![Dependency Status](https://gemnasium.com/cortexjs/cortex-scaffold-generator.svg)](https://gemnasium.com/cortexjs/cortex-scaffold-generator)

Generates the cortex scaffold files for new project.

## Installation

```bash
npm install cortex-scaffold-generator --save
```

## generator(pkg, options, callback)

- pkg `Object` the object of cortex.json
- options `Object`
	- override `Boolean='false'` whether should override existing files
	- cwd `path` current working directory
	- template `String='default'` template name. Actually, there's only one available template which is `'default'`.
	- license `String='MIT'`
  - neuron_version `String` version of neuron
	
- callback `function(err)`
- err `Error`
