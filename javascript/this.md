# javascript里的this
## 什么是this
**this是当前[执行上下文](./context.md)（global、function 或 eval）的一个属性。在es5中，this 永远指向最后调用它的那个对象。**

### es5中this的4种绑定方法
#### 1 默认绑定
**规则：在非严格模式下，函数里的默认绑定的this指向全局对象，严格模式下this指向undefined。**

```javascript
    var name = "windowsName";
    function a() {
        var name = "aName";

        console.log(this.name);          // windowsName

        console.log("inner:" + this);    // inner: Window
    }
    a();
    console.log("outer:" + this)         // outer: Window
```
在上面例子中，调用a函数的是全局作用域，在非严格模式下函数内的this指向window。  

```javascript
var name = "windowsName";
    function a() {
        'use strict'
        var name = "aName";

        console.log(this.name);          

        console.log("inner:" + this);    
    }
    a();
    console.log("outer:" + this)     
```
此处在严格模式执行a函数，导致全局作用域下this的值undefined，没有被转化为全局对象window，因此报错`TypeError: Cannot read property 'name' of undefined`。

#### 2 隐式绑定
**this指向最后调用函数的对象上。**
```javascript
function foo() {
      console.log(this.a);
    }
    var a = "Oops, global";
    let obj2 = {
      a: 2,
      foo: foo
    };
    let obj1 = {
      a: 22,
      obj2: obj2
    };
    obj2.foo(); // 2 this指向调用函数的对象
    obj1.obj2.foo(); // 2 this指向最后一层调用函数的对象
```
#### 3 显式绑定
**通过call、bind、apply修改this指向。**
```javascript
function foo() {
    console.log(this.a);
}
let obj = {
    a: 2
};
foo.call(obj); // 2
```
> 在 JavaScript 严格模式(strict mode)下, 在调用函数时第一个参数会成为 this 的值， 即使该参数不是一个对象。
> 
> 在 JavaScript 非严格模式(non-strict mode)下, 如果第一个参数的值是 null 或 undefined, 它将使用全局对象替代。  

#### 4 new绑定
**规则：使用构造调用的时候，this会自动绑定在new期间创建的对象上。**
```javascript
function Foo(a) {
  this.a = a; // this绑定到bar上
}
let bar = new Foo(2);
console.log(bar.a); // 2
```

### 4种绑定方法的优先级
由隐式绑定的例子可以看出，隐式绑定>默认绑定。

```javascript
function foo() {
  console.log(this.a);
}
 
var obj1 = {
  a: 10,
  foo,
};
 
var obj2 = {
  a: 20,
  foo,
};
 
obj1.foo();   //10
obj2.foo();   //20
 
obj1.foo.call(obj2);   //20
obj2.foo.call(obj1);   //10
```
由以上例子可以看出显式绑定 > 隐式绑定。


```javascript
function Foo() {
  this.a = 'foo';
}
 
let obj = {
  a: 'obj'
};
// 1、bind
const Bar = Foo.bind(obj);
// 2、new
const bar = new Bar();
console.log(obj.a, '--', bar.a) 
```
bar.a还是Foo构造函数的值，并没有被bind影响，因此可知new绑定 > 显式绑定。

综上，**new绑定 > 显式绑定 > 隐式绑定 > 默认绑定**。

## es6中的箭头函数

 ES6 的箭头函数使得this总是指向函数定义时的上下文的this，和es5的函数this取决于调用时不同。
```javascript
var a = 1
var foo = () =>{
  console.log(this.a);
}
 
var obj1 = {
  a: 10,
  foo,
};

 
obj1.foo();   // 1
```
打印出来是1，因为函数foo定义在全局作用域中，this永远指向全局作用域。

来看下面的测试题：
```javascript
 var name = 'window'

 var person1 = {
   name: 'person1',
   show: function () {
     return () => console.log(this.name)
   }
 }
 var person2 = { name: 'person2' }
 
 person1.show()()  //person1
 person1.show().call(person2) //person1
 person1.show.call(person2)() // person2
```
person1.show中箭头函数定义外层的this指向person1，因此person1.show()() 指向person1。

对于person1.show().call(person2)，person1.show()返回了箭头函数，而箭头函数的this只取决于定义时，因此仍旧返回person1。

对于person1.show.call(person2)()，person1.show的this被call方法改为了person2，箭头函数的this取决于定义时所在的作用域，指向person2，因此返回person2。

## 参考资料
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this
https://juejin.cn/post/6844903496253177863
https://juejin.cn/post/6844903630592540686
https://blog.csdn.net/huan1043269994/article/details/107539567
https://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0
