
# nodejs事件循环

## nodejs事件循环分析

<!-- 事件循环操作顺序的简化概览：

![nodejs事件循环](https://github.com/calali/imagehost/blob/main/WX20210504-195258@2x.png?raw=true)

1. 定时器：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
2. 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
3. idle, prepare：仅系统内部使用。
4. 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。
5. 检测：setImmediate() 回调函数在这里执行。
6. 关闭的回调函数：一些关闭的回调函数，如：socket.on('close', ...)。 -->

从Node.js v11开始，事件循环的原理发生了变化，在同一个阶段中只要执行了macrotask就会立即执行microtask队列，与浏览器表现一致。

## setImmediate() 和 setTimeout() 执行顺序

setImmediate() 和 setTimeout() 很类似，但是基于被调用的时机，他们也有不同表现。

setImmediate() 设计为一旦在当前 轮询 阶段完成， 就执行脚本。
setTimeout() 在最小阈值（ms 单位）过后运行脚本。

**执行计时器的顺序将根据调用它们的上下文而异，也就是说主线程中这两者的执行顺序是不确定的。**如果二者都从主模块内调用，则计时器将受进程性能的约束（这可能会受到计算机上其他正在运行应用程序的影响）。

## process.nextTick()在node中的执行顺序？

process.nextTick 不属于事件循环的任何一个阶段，它属于该阶段与下阶段之间的过渡, 即本阶段执行结束, 进入下一个阶段前, 所要执行的回调。

## 练手题目

### 题目一

```javascript
console.log(1)
Promise.resolve().then(function () {
  console.log('then')
})
process.nextTick(function () {
  console.log('nextTick')
});
```

执行结果：

1

nextTick

then

### 题目二

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
  process.nextTick(() => console.log('nextTick1'));
}
async function async2() {
  process.nextTick(() => console.log('nextTick2'));
  console.log('async2')
}
console.log('script start')

setTimeout(function () {
  console.log('setTimeout3')
}, 3)
setImmediate(() => {
  process.nextTick(() => console.log('nextTick3'));
  console.log('setImmediate')
});
process.nextTick(() => console.log('nextTick4'));
async1();
process.nextTick(() => console.log('nextTick5'));
new Promise(function (resolve) {
  console.log('promise1')
  resolve();
  console.log('promise2')
  process.nextTick(() => console.log('nextTick6'));
}).then(function () {
  process.nextTick(() => console.log('nextTick7'));
  console.log('promise3')
})
console.log('script end')
```

分析：

1. 首先执行同步代码，打印出script start
2. 将setTimeout和setImmediate加入异步任务队列
3. 获取一个nextTick4
4. 执行async1，打印async1 start和async2
5. 获取将async2的nextTick2，暂不执行
6. 获取一个nextTick5
7. 继续执行同步代码new Promise，打印promise1和promise2, 获取nextTick6
8. 继续执行同步代码，打印script end
9. 到这里同步代码执行完毕。这之后待执行的有定时器、微任务和nextTick
10. 在开始事件循环前，先执行之前的nextTick, 按照加入的顺序执行
11. 先执行微任务，打印async1 end，获取nextTick1，获取nextTick7，打印promise3
12. 在执行微任务过程中，产生了nextTick，在微任务执行完毕后，执行nextTick
13. 执行异步任务，在主线程中setImmediate() 和 setTimeout()的执行顺序是不确定的。因此setTimeout3和setImmediate的打印顺序不确定
14. 可以肯定的是，setImmediate先打印，nextTick3后打印

执行结果：

script start

async1 start

async2

promise1

promise2

script end

nextTick4

nextTick2

nextTick5

nextTick6

async1 end

promise3

nextTick1

nextTick7

setTimeout3

setImmediate

nextTick3

## 参考资料

1. <https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/>
2. <https://blog.csdn.net/xgangzai/article/details/89647029>
3. <https://juejin.cn/post/6844903999506923528>