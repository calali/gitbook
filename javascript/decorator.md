# 装饰器模式

## 什么是装饰器模式

装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。

装饰器是一种函数，写成@ + 函数名。它可以放在类和类方法的定义前面。

## 可以装饰的范围

### 类

```javascript
@testable
class MyTestableClass {
  // ...
}
function testable(target) {
  target.isTestable = true;
}
MyTestableClass.isTestable // true
```

### 类的方法

```javascript
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```

### 不能装饰函数

装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升导致装饰器不能起作用。

## 目前支持情况

ecmascript对类级别的装饰器已经进入![stage2](https://tc39.es/proposal-decorators/) 了，大概率会继续推进。

typescript支持![decorator语法](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Decorators.html)。

babel支持![decorator语法](https://babel.docschina.org/docs/en/babel-plugin-proposal-decorators/)。

## 项目实战

TODO
https://vince.xin/2019/11/29/Decorator-%EF%BC%88%E8%A3%85%E9%A5%B0%E5%99%A8%EF%BC%89%E5%85%A5%E9%97%A8%E4%BB%A5%E5%8F%8A%E5%9C%A8%E5%89%8D%E7%AB%AF%E6%8E%A5%E5%8F%A3%E9%80%BB%E8%BE%91%E5%B1%82%E4%B8%AD%E7%9A%84%E5%AE%9E%E8%B7%B5/

https://segmentfault.com/a/1190000023471570

## 源码解析

https://github.com/mqyqingfeng/Blog/issues/109

## 参考资料
<https://www.bookstack.cn/read/es6-3rd/docs-decorator.md>
<https://zhuanlan.zhihu.com/p/27762556>
<https://juejin.cn/post/6844904030838194189>
<https://babel.docschina.org/docs/en/babel-plugin-proposal-decorators/>
<https://github.com/tc39/proposal-decorators>
https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Decorators.html
https://github.com/mqyqingfeng/Blog/issues/109
https://zhuanlan.zhihu.com/p/32856278
<https://vince.xin/2019/11/29/Decorator-%EF%BC%88%E8%A3%85%E9%A5%B0%E5%99%A8%EF%BC%89%E5%85%A5%E9%97%A8%E4%BB%A5%E5%8F%8A%E5%9C%A8%E5%89%8D%E7%AB%AF%E6%8E%A5%E5%8F%A3%E9%80%BB%E8%BE%91%E5%B1%82%E4%B8%AD%E7%9A%84%E5%AE%9E%E8%B7%B5/>
https://segmentfault.com/a/1190000023471570