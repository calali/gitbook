# 面试官，实现promise.all和（或）promise.race

## 实现promise.race

### 定义

promise.race是同时执行多个promise，任何一个promise首先变成fulfilled或rejected状态后，promise.race即返回这个状态和对应的值。

### 实现

先看题目：

```javascript
const promise1 = new Promise((resolve, reject) => {
	setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
	setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
	console.log(value);
	// Both resolve, but promise2 is faster
});
// expected output: "two"
```

实现代码：

```javascript
const race = (promiseList)=>{
	return new Promise((resolve,reject)=>{
		promiseList.forEach(promise => {
			promise.then((res)=>{
				resolve(res)
			}).catch(e => reject(e))
		});
	})
}
```

实现代码利用了promise的状态一旦fulfilled或rejected，就不能再被改变，从而捕获了首先改变状态的promise。

测试：

```javascript
race([promise1, promise2]).then((value) => {
	console.log(value); //two
	// Both resolve, but promise2 is faster
});
```

符合预期。

## 实现promise.all

### 定义

promise.all是同时执行多个promise，任何一个promise变成rejected状态后，promise.all即返回这个状态和对应的值；或者当所有的promise都fulfilled后，promise.all即返回fulfilled状态和所有promise的数组格式的值。

### 实现

先看题目：

```javascript
const promise1 = new Promise((resolve, reject) => {
	setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
	setTimeout(resolve, 100, 'two');
});

Promise.all([promise1, promise2]).then((value) => {
	console.log(value);
}).catch((e)=>{
	console.log('error',e );
})
// expected output:[ 'one', 'two' ]
```

实现代码：

```javascript
const all = (promiseList)=>{
	return new Promise((resolve,reject)=>{
		const list = new Array(promiseList.length)
		let count = 0
		promiseList.forEach((promise,index) => {
			promise.then((res)=>{
				list[index] = res
				count++
				if (count === promiseList.length ){
					resolve(list) //当所有的promise都fulfilled后，promise.all即返回fulfilled状态和所有promise的数组格式的值。
				}
			}).catch(e => reject(e)) //任何一个promise变成rejected状态后，promise.all即返回这个状态和对应的值
		});
	})
}
```

测试：

```javascript
all([promise1, promise2]).then((value) => {
	console.log(value); //['one', 'two']
}).catch((e) => {
	console.log('error', e);
})
```

new MyPromise((res,rej)=>{
    res('a')
}).then(res=>{
console.log('1',res);
return 'aa'
}).then(res=>{
console.log('11',res);
})