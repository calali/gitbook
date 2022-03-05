# 事件循环

## 什么是事件循环？

javascript在浏览器和v8引擎里运行，javaScript是单线程非阻塞的语言。

那么是如何做到非阻塞执行的呢？靠的就是事件循环。

## 事件循环执行逻辑

在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务处理模型是比较复杂的，但关键步骤如下：

1. 执行栈执行一段程序，这个被认为是执行宏任务
2. 在这个过程中，将新的宏任务添加到宏任务队列中；将微任务添加到微任务队列中
3. 宏任务执行完毕后，执行所有的微任务；在这个过程中新产生的微任务也会被执行，直到清空微任务队列
4. 这一轮事件循环宣告结束
5. 如果有必要，进行浏览器渲染
6. 重新回到第一步，执行栈继续执行下一个宏任务（此时的微任务在上一轮中已经被清空），继续事件循环

因此优先级：微任务>宏任务

## 任务分类

### 宏任务分类

1. 一段新程序或子程序被直接执行时
2. 触发了一个事件，将其回调函数添加到任务队列时
3. 执行到一个由 setTimeout() 或 setInterval() 创建的 timeout 或 interval，以致相应的回调函数被添加到任务队列时
4. postMessage
5. requestAnimationFrame

### 微任务分类

1. promises ：Promise.then、Promise.catch、Promise.finally等相关api。
2. MutationObserver(html5 新特性)
3. queueMicrotask(自定义微任务)

<!-- ## node和浏览器里的事件循环的区别

node11及以后版本和浏览器里的执行顺序一致。

详细参考[nodejs事件循环](./nodejsEventloop.md) -->

## 事件循环面试题目

### 题目一

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');
```

执行结果如下:

script start

async1 start

async2

promise1

script end

async1 end

promise2

setTimeout

注意async函数里的await后的代码都是异步执行的，及promise.then中的执行顺序。

### 题目二

```javascript
console.log('start');
setTimeout(() => {
    console.log('children2');
    Promise.resolve().then(() => {
        console.log('children3');
    })
}, 0);

new Promise(function(resolve, reject) {
    console.log('children4');
    setTimeout(function() {
        console.log('children5');
        resolve('children6')
    }, 0)
}).then((res) => {
    console.log('children7');
    setTimeout(() => {
        console.log(res);
    }, 0)
})
```

执行结果：

start

children4

children2

children3

children5

children7

children6

### 题目三

```javascript
const p = function() {
    return new Promise((resolve, reject) => {
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(1)
            }, 0)
            resolve(2)
        })
        p1.then((res) => {
            console.log(res);
        })
        console.log(3);
        resolve(4);
    })
}


p().then((res) => {
    console.log(res);
})
console.log('end');
```

执行结果:

3

end

2

4

## 相关问题

1. 异步任务怎么进了事件队列？
web api是如事件回调浏览器放到宏任务队列的，v8没有浏览器相关的api。

2. js代码里的渲染代码和事件循环关系是什么呢？
见[浏览器渲染原理](./browser.md)

3. JavaScript运行时都包含什么呢？
参考[JavaScript运行时](./runtime.md)

4. requestAnimationFrame是宏任务还是微任务?
参考[requestAnimationFrame](./requestAnimationFrame.md)

## 参考资料

1. https://segmentfault.com/a/1190000022805523
2. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function
