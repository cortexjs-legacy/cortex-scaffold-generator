# {%= name %}

{%= description %}

## Installation

```bash
cortex install {%= name %} --save
```

## Usage

```js
var {%= js_name %} = require('{%= name %}');
```

<!-- 

NOTICE That this is a sample README.md, in order to define the standard way to organize the information of the current package.

Most usually, you should remove unnecessary sections below.

这里仅仅是一个示例README，用于定义标准的书写规范和文档格式。
大部分时候，如果没有使用到它们，你应该把适当移除他们。
-->

### Class: {%= js_name %}(options)
<!-- 
'Class: <name>' means a constructor that we should use it with the `new` keyword.
'Class: <name>' 表明它是一个构造器，我们应当使用 `new` 关键字来初始化。

Wrap examples with a pair of ```
使用成对的 ``` 来包裹示例。
-->

```js
new {%= js_name %}({
	name: 'Hulk'
});
```

<!-- 
Simply list arguments
直接列出参数
-->
- options `Object` description of `options`
	- name `String` description of `options.name`
	
Creates a new {%= name %} instance.

<!--
Only differences are listed below.
接下来我们只列出不同的地方
-->
	
#### .\<method-name\>(foo, bar, bee, boo)

<!-- 
A method of the instance
实例（即通过构造器 new 出来的对象）上的方法
-->


- foo `String='foo'` description of `foo`
- bar `Boolean=` description of `bar`
- bee ``
- boo `function(arg1, arg2)` what is the method used for
- arg1 `Object={}`  

<!--
type ends with `=`(equal) indicates the default value, default to `undefined`
类型后面跟等号（=）表明了这个参数的默认值
-->

<!--
Notice the definition of function type.
注意函数类型定义的描述。
-->


### {%= name %}.\<method-name\>(arguments)

<!-- 
The static method.
静态方法，即不是实例上的方法
-->



