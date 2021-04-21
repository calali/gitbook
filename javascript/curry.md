## 从一道面试题谈谈函数柯里化

#### 面试题
面试中，面试官问，如何实现 add(1)(2)(3)=6 ？

稍一思索，写出如下代码：
```javascript
function add(a) {
    return function (b) {
        return function (c) {
            return a + b + c
        }
    }
}
```
面试官继续追问，那如果不确定add后面的括号的个数与括号里的参数个数呢？

顿时发现事情没那么简单，这里就需要走入本文的主题，咱们继续往下看。
#### 什么是函数柯里化
把接受多个参数的函数变换成接受一个单一参数的函数。

#### 函数柯里化的实现
```javascript
var curry = fn =>
    judge = (...args) =>
        args.length === fn.length
            ? fn(...args)
            : (arg) => judge(...args, arg)
```
#### 函数柯里化的应用

##### 参数复用


##### 延迟运行


#### 为什么面试要问函数柯里化？

#### 相关领域？
函数式编程？
高阶函数？
纯函数？

#### 参考文档
https://zh.wikipedia.org/zh/%E6%9F%AF%E9%87%8C%E5%8C%96
https://github.com/mqyqingfeng/Blog/issues/42