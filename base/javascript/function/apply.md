# JavaScript里的call、bind、apply实现

## call、bind、apply的相同点和不同点

### 相同点

1. 是所有函数都能调用的方法，是Function.prototype里的方法
2. 都能改变this指向，作为第一个参数
3. 支持传递参数，第二个参数及之后的所有个数的参数

### 不同点

1. call和apply都能调用函数，而bind不调用，返回新的函数
2. 传参方式不一样，call和bind是单个传参，apply是数组传参

## 实现call、bind、apply

### 1 非严格模式下，传入undefined或null等于传入全局变量

全局变量这里我们兼容浏览器和node.js环境使用[globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)。

非严格模式下，传进去的非对象类型的值都会被包装成对象，这里需要对context包裹成对象类型。

```javascript
    Function.prototype.call = function(context) {
        context = context === undefined || context === null ? globalThis : Object(context)
    }

    Function.prototype.apply = function(context) {
        context = context === undefined || context === null ? globalThis : Object(context)
    }

    Function.prototype.bind = function(context) {
        context = context === undefined || context === null ? globalThis : Object(context)
    }

```

### 2 获取参数

call和bind的参数是单个传入的，可以使用es6的rest参数来获取参数的数组格式。而apply的参数传入就是数组格式，不需要转换。
```javascript
Function.prototype.call = function(context, ...args) {
    context = context === undefined || context === null ? globalThis : Object(context)
}

Function.prototype.apply = function(context, args) {
    context = context === undefined || context === null ? globalThis : Object(context)
}

Function.prototype.bind = function(context, ...bindArgs) {
    context = context === undefined || context === null ? globalThis : Object(context)
}
```

### 3 修改this指向

来看以下例子。

```javascript
let Person = {
  name: 'Tom',
  say() {
      console.log(this) //{ name: 'Tom1' }
      console.log(`我叫${this.name}`) // 我叫Tom1
  }
}

// 先看代码执行效果
// Person.say() //我叫Tom 
let Person1 = {
  name: 'Tom1'
}

// 我们尝试用原生方法call来实现this指向Person1
Person.say.call(Person1) //我叫Tom1
```
call方法前是调用的函数say，call方法的第一个参数是Person1。

在函数中this指向的是调用的它的对象，在上面这个例子中，this指向say方法。call的第一个参数是真正要执行的上下文Person1。

因此在这个上下文Person1上添加上say方法，并执行say方法。此时say方法里的this指向调用它的对象，即Person1。

当当，通过为不同对象添加方法，成功改变了方法里的this指向对象！

```javascript
Function.prototype.call = function(context, ...args) {
    context = context === undefined || context === null ? globalThis : Object(context)
    const fn = Symbol('fn')
    context[fn] = this
    context[fn](...args)
}

Function.prototype.apply = function(context, args) {
    context = context === undefined || context === null ? globalThis : Object(context)
    const fn = Symbol('fn')
    context[fn] = this
    context[fn](...args)
}

Function.prototype.bind = function(context, ...bindArgs) {
    context = context === undefined || context === null ? globalThis : Object(context)
    const fn = Symbol('fn')
    context[fn] = this
    return function(...args) {
        context[fn](...bindArgs, ...args)
    }
}
```
为什么以上代码会添加一个symbol属性到context，而不是一个普通属性呢？因为symbol可以保证独一无二的属性名，不会造成属性名的冲突，不会造成任何的意外。

### 完善
删掉对context添加的属性，保持对context的整洁。并返回函数执行的结果。

```javascript
Function.prototype.call = function(context, ...args) {
    context = context === undefined || context === null ? window : Object(context)
    const fn = Symbol('fn')
    context[fn] = this
    const result = context[fn](...args)
    delete context[fn]
    return result
}

Function.prototype.apply = function(context, args) {
    context = context === undefined || context === null ? window : Object(context)
    const fn = Symbol('fn')
    context[fn] = this
    const result = context[fn](...args)
    delete context[fn]
    return result
}

Function.prototype.bind = function(context, ...bindArgs) {
    context = context === undefined || context === null ? window : Object(context)
    return (...args) => this.apply(context, [...bindArgs, ...args])
}
```

## 参考资料

1. <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call>
2. <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply>
3. <https://juejin.cn/post/6844903763564560397>
4. <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object>
5. <https://www.jianshu.com/p/7f2cdb8297f5>
7. https://es6.ruanyifeng.com/#docs/function#rest-%E5%8F%82%E6%95%B0
8. https://es6.ruanyifeng.com/#docs/symbol