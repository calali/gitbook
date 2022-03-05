# 原型

## __proto__和prototype

构造函数的prototype和其实例的\__proto__是指向同一个地方的，这个地方就叫做原型对象。

## Function和Object

函数是Function构造函数的实例
对象是Object构造函数的实例

function Object()其实也是个函数，所以他是Function构造函数的实例
function Function()其实也是个函数，所以他也是Function构造函数的实例，没错，他是他自己本身的实例

```javascript
console.log(Function.prototype === Object.__proto__) // true
console.log(Function.prototype === Function.__proto__) // true
console.log(Function.prototype.__proto__ === Object.prototype) // true
```

## constructor 
constructor和prototype是成对的，你指向我，我指向你。

## 原型链
\__proto__的路径就叫原型链

### 原型链终点
```javascript
Object.prototype.__proto__=null
```
## 原型继承
实例可以使用构造函数上的prototype中的方法

## instanceof

A instanceof B，判断B的prototype是否在A的原型链上

## 参考文档
https://juejin.cn/post/7007416743215759373

https://juejin.cn/post/7008526225207640078