# 谈谈JavaScript里的遍历

## 如何知道一个数据是不是可以遍历的？

根据ES6的规定，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）。

Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器Iterator。

## Iterator的遍历过程
Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的next方法，直到它指向数据结构的结束位置。

每一次调用**next**方法，都会返回数据结构的当前成员的信息。具体来说，就是**返回一个包含value和done两个属性的对象**。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

以下是一个无限运行的遍历器对象示例：

```javascript
var it = idMaker();

it.next().value // 0
it.next().value // 1
it.next().value // 2
// ...

function idMaker() {
  var index = 0;

  return {
    next: function() {
      return {value: index++, done: false};
    }
  };
}
```

## Iterator的作用
Iterator 的作用有三个：
1. 为各种数据结构，提供一个统一的、简便的访问接口；
2. 使得数据结构的成员能够按某种次序排列；
3. ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

## 原生具备 Iterator 接口的数据结构有哪些？
* Array
* Map
* Set
* String
* TypedArray
* 函数的 arguments 对象
* NodeList 对象

由以上列表可知对象并没有自带 Iterator 接口。如果要对对象进行for...of遍历，需要先为对象制定Symbol.iterator。
  
## 还有哪些遍历方法？

### for...in语句以任意顺序遍历一个对象的除Symbol以外的可枚举属性。
```javascript
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x in a) {
    alert(x); // '0', '1', '2', 'name'
}
```
### 数组专有的遍历方法

forEach() 方法对数组的每个元素执行一次给定的函数。
map() 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。

### 哪些遍历方法支持break和continue？
for循环、for-in循环、for-of循环。
而方法遍历函数如map、forEach、filter则不支持。

### 哪些遍历方法会跳过空值？
forEach(), filter(), every() 和some()都会跳过空位。

map()会跳过空位，但会保留这个值。

建议在遍历数组时，先处理空位，再进行遍历，以免出现意外结果。

### 如何对异步对象数组进行遍历？

for await of 
```javascript
function Gen(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(time)
    },time)
  })
}

async function test() {
  let arr = [Gen(2000), Gen(1000), Gen(3000)]
  for await (let  item of arr) {
    console.log(Date.now(), item)
  }
}

  test()
  // 1621742129395 2000
  // 1621742129405 1000
  // 1621742130398 3000
```
## 参考资料
1. https://es6.ruanyifeng.com/?search=iterator&x=0&y=0#docs/iterator
2. https://juejin.cn/post/6844903810209415181
3. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of