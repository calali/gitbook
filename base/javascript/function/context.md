# 作用域

## 定义

作用域是在函数声明的时候就确定的一整套函数内标识符的访问规则。

每个语言的作用域可以采用词法或动态作用域。

词法作用域和动态作用域的区别是：
词法作用域是在写代码或者说变量定义时确定的；
动态作用域是在运行时确定的；

JavaScript语言采用的词法作用域。


## 作用域的范围类型

|  作用域（Scope）   | 范围  |
|  ----  | ----  |
| window/global Scope  | 全局作用域 |
| function Scope  | 函数作用域 |
| Block Scope  | 块作用域（ES6） |

全局作用域是默认的执行环境，所有代码都被包含进去的执行环境。在浏览器中，会创建全局对象window，并将全局环境中的this指向window。全局作用域只有一个。

每次调用函数，就会创建函数的作用域。多个函数互相调用，会形成多个函数的作用域栈。函数作用域可以有任意多个，具体数量取决于函数调用的次数。

块级作用域可通过新增命令let和const声明，所声明的变量在指定块的作用域外无法被访问。块级作用域在如下情况被创建：在一个函数内部、在一个代码块（由一对花括号包裹）内部。

## 作用域链/执行栈

执行栈是一种先进后出的数据结构。

```javascript
function n1(){
	n2()
	console.log('n1')
}
function n2(){
	n3()
	console.log('n2')
}
function n3(){
	console.log('n3')
}
```

以上代码，会按照n1、n2、n3的顺序入栈。n1在栈低第二层，n3在栈顶，全局作用域在最底层。n3执行完后出栈继续执行n2，n2执行完后出栈，继续执行n1。n1执行完后也出栈。

从而作用域可以根据函数执行的顺序分层，以便子作用域可以访问父作用域，通常是指沿着链式的作用域链查找，而不能从父作用域引用子作用域中的变量和引用。

## 词法作用域例子

```javascript
var x = 10
function fn() {
  console.log(x)
}
function show(f) {
  var x = 20
  (function() {
    f() //10，而不是20
  })()
}
show(fn)
```

## 执行上下文VS作用域
作用域是在函数声明的时候就确定的一整套函数内标识符的访问规则，而执行上下文是函数执行时才产生的一系列变量的环境。

前者是定义时就产生的，后者是执行时产生的。


## 参考资料
1. https://developer.mozilla.org/zh-CN/docs/Glossary/Scope
2. https://juejin.cn/post/6844903682283143181
3. https://juejin.cn/post/6844903788977848334
4. https://juejin.cn/post/7054205471791513613
5. https://juejin.cn/post/6844903797135769614