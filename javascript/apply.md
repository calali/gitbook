# JavaScript里的call、bind、apply

## call、bind、apply的相同点和不同点

### 相同点

1. 是所有函数都能调用的方法，是Function.prototype里的方法
2. 都能改变this指向，作为第一个参数
3. 传递参数，第二个参数及之后的所有个数的参数

### 不同点

1. call和apply都能调用函数，而bind不调用，返回新的函数
2. 传参方式不一样，call和bind是单个传参，apply是数组传参

## 实现call、bind、apply

### 1 非严格模式下，传入undefined或null等于传入全局变量

```javascript
    Function.prototype.call = function(context) {
        context = context === undefined || context === null ? window : Object(context)
    }

    Function.prototype.apply = function(context) {
        context = context === undefined || context === null ? window : Object(context)
    }

    Function.prototype.bind = function(context) {
        context = context === undefined || context === null ? window : Object(context)
    }

```

### 2 获取参数

```javascript
Function.prototype.call = function(context, ...args) {
    context = context === undefined || context === null ? window : Object(context)
}

Function.prototype.apply = function(context, args) {
    context = context === undefined || context === null ? window : Object(context)
}

Function.prototype.bind = function(context, ...bindArgs) {
    context = context === undefined || context === null ? window : Object(context)
}
```

### 3 修改this指向

```javascript
Function.prototype.call = function(context, ...args) {
    context = context === undefined || context === null ? window : Object(context)
    const fn = Symbol('fn')
    context[fn] = this
    context[fn](...args)
}

Function.prototype.apply = function(context, args) {
    context = context === undefined || context === null ? window : Object(context)
      const fn = Symbol('fn')
    context[fn] = this
    context[fn](...args)
}

Function.prototype.bind = function(context, ...bindArgs) {
    context = context === undefined || context === null ? window : Object(context)
    const fn = Symbol('fn')
    context[fn] = this
    return function(...args) {
        context[fn](...bindArgs, ...args)
    }
}
```

### 4 测试用例

## 参考资料

1. <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call>
2. <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply>
3. <https://juejin.cn/post/6844903763564560397>
4. <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object>
5. <https://www.jianshu.com/p/7f2cdb8297f5>