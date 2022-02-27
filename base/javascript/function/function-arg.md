# 从一道校招面试题谈谈“函数参数传参按值传递”

## 请看下面这道面试题

```javascript
function getBookName(obj) {
	obj.name = 'a';
	obj = Object.create(null);
	obj.name = "b";
}

const book = Object.create(null);
getBookName(book);

console.log(book.name);
```

打印出来的值是什么呢？
有3种回答：

1. undefined
2. a
3. b

那么正确答案是什么呢？我们继续往下看。

## 函数参数按值传递

这句话怎么理解呢？

1. 当函数参数为基本类型时，会把变量的**值**拷贝给函数参数，参数在函数中是一个局部变量。
2. 当函数参数为引用类型时，会把变量的**引用地址**拷贝给函数参数，参数在函数中是一个局部变量。

因此在上方例子中，obj获取了book的引用地址，因此obj.name = 'a';执行成功；
当执行obj = Object.create(null);时，obj这个局部变量指向了新的地址，不再指向与book变量共同的引用地址，因此obj此后的改变不再体现到book上。因此正确结果是2。

## 总结

下面这3段代码的执行结果，你理解了吗？

### 片段一

```javascript
function getBookName(obj) {
	obj.name = 'a';
	obj = Object.create(null);
	obj.name = "b";
	console.log(obj) //[Object: null prototype] { name: 'b' }
}

const book = Object.create(null);
getBookName(book);

console.log(book.name);//a
```

### 片段二

```javascript
function getBookName(obj) {
	obj.name = 'a';
}

const book = Object.create(null);
getBookName(book);

console.log(book.name);//a
```

### 片段三

```javascript
function changeNum(val) {
	val = 5
	console.log(val);// 5
	return val;
}

let num = 10;
let result = changeNum(num);

console.log(num); // 10
console.log(result); // 5
```