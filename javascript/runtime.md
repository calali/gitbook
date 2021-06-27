# 来说说浏览器中的JavaScript运行时环境（JavaScript runtime environment）

## 什么是JavaScript运行时？
JavaScript代码由JavaScript引擎执行。在执行的过程中，需要维护了一组代理才能良好地执行JavaScript代码。这个代理包含：

1. 一组执行上下文的集合
2. 执行上下文栈(也叫调用栈)
3. 主线程
4. 一组可能创建用于执行 worker 的额外的线程集合
5. 一个任务队列
6. 一个微任务队列

某些JavaScript引擎可能会多个代理之间共享主线程。除了主线程之外的其他部分对该代理都是唯一的。
即每个网页的页面的1、2、4、5、6都是该网页唯一拥有的内容，不会在多个网页之间共享。


以Chrome浏览器里的运行时环境为例，下如图所示：
![JavaScript runtime](https://user-gold-cdn.xitu.io/2019/3/3/16943fd819a25a8a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
## 组成部分

### JavaScript引擎

JavaScript引擎包含堆内存和调用栈。一个JavaScript引擎只有一个调用栈，调用栈一次只能处理一个。所以JavaScript是单线程语言。
#### 堆内存（heap） 
堆内存,也是V8引擎的一部分。当V8引擎遇到变量声明和函数声明的时候，就把它们存储在堆里面。

#### 执行上下文栈 (Execution context stack / ECS)

调用栈, 也是V8引擎的一部分。当引擎遇到像函数调用之类的可执行单元，就会把它们推入调用栈。一旦被推入栈，就开始解析函数的代码，在堆里创建变量，继续往栈顶加入新的函数，或者把函数自身派发到web api 容器。

当函数返回了或者被派发到了web api容器里，函数就出栈。调用栈继续执行下一个函数。

调用栈是一个后进先出的数据结构。

### web api 容器（web api container）

从调用栈派发到web api 容器的api的调用由浏览器执行。api包含dom的事件监听，定时器，ajax请求等。当一个事件或api执行后，会把回调函数放到回调队列里。

### 回调队列(callback queue)/消息队列(message queue)

回调队列是先进先出的数据结构。包含（宏）任务队列和微任务队列。

### 事件循环（event loop）
持续地检查调用栈和回调队列。当调用栈空了后，事件循环会把回调队列里面存储的最前面的回调函数放到调用栈里执行。当调用栈执行完毕再次清空后，事件循环会继续把回调函数放到调用栈里执行。
这就是JavaScript能够异步非阻塞地执行的原因。

关于事件循环的具体执行过程，可以看[这里](./../browser/eventloop.md)。
## JavaScript引擎
JavaScript是一种高级的、解释型语言，并不能直接由计算机运行。它由JavaScript引擎解析成计算机可以识别的机器语言。
chrome浏览器和node.js里的JavaScript解析器是著名的v8引擎。

## 参考资料
1. https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth
2. https://blog.bitsrc.io/javascript-internals-javascript-engine-run-time-environment-settimeout-web-api-eeed263b1617
3. https://olinations.medium.com/the-javascript-runtime-environment-d58fa2e60dd0
4. https://juejin.cn/post/6844903788977848334
## 问题
1. 调用栈里只有函数吗》