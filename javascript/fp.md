# 函数式编程

面向对象的编程关注数据，函数式编程关注过程。

## 几个概念

### 函数是一等公民

第一等公民是指函数跟其它的数据类型一样处于平等地位，可以赋值给其他变量，可以作为参数传入另一个函数，也可以作为别的函数的返回值。

接受和/或返回另外一个函数的函数被称为高阶函数。

### 纯函数

纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互。

举个例子，js里的slice是纯函数，splice不是纯函数,因为slice没有修改传入的数组，而splice修改了传入的数组。

#### 纯函数的好处

1. 可缓存
2. 可移植
3. 可测试性

### compose

将多个函数组合在一起执行。

```javascript

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => {
    return (...args) => {
      return a(b(...args))
    }
  });
}

let sayHello = (...str) => `Hello , ${str.join(" And ")}`;
let toUpper = str => str.toUpperCase();
let replace = str => str.replace('a','replace');
let combin = compose(
  sayHello,
  toUpper,
  replace
);

console.log(combin('alice')); //Hello , REPLACELICE

```

分析下compose函数，使用reduce累计器，第一次调用sayHello和toUpper函数返回一个新的函数，称为a，下一次a和replace函数组合返回新的函数b。执行顺序是replace、toUpper、sayHello从右往左的顺序。

### curry

参考[函数柯里化](./curry.md)

### 参考文档

1. <https://juejin.cn/post/6844903988647690254>
2. <https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/>
3. <https://juejin.cn/post/6844903638368780295>
4. <https://juejin.cn/post/6844903936378273799>
5. <https://juejin.cn/post/6844903988647690254>
