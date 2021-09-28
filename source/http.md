# 分析下项目中常用的 axios 的实现

现代前端项目离不开发送请求，而发送请求最常用的就是 axios。

那么 axios 到底是如何发送请求的呢？今年我们来看看 axios 的实现脉络。

## axios 的主线实现

### 代码先跑起来

从 GitHub 上下载 axios 的仓库代码到本地,执行如下命令：

```javascript
npm install
npm start
```

在浏览器中打开 http://localhost:3000/测试发送请求。

此时走的 client.html 进行发送请求。

我们在 client.html 打印出 axios，看看都包含什么？

![axios打印出来都包含什么](https://picasso-static.xiaohongshu.com/fe-platform/cb7aab8088d6d21627e1a9d41186792eccf9745e.png)

### axios是什么

axios 是一个函数名为 wrap 的函数，我们来看下wrap的实现。

```javascript
function createInstance(defaultConfig) {
  // 首先创建了一个Axios实例context
  var context = new Axios(defaultConfig)
  //   通过bind获取instance，instance就是对外暴露的axios。instance是wrap函数。wrap函数体是执行Axios的request方法，this是context，参数是wrap的参数。
  var instance = bind(Axios.prototype.request, context)

  // Copy axios.prototype to instance
  //   把Axios的原型方法都绑定到instance上，这样就可以直接使用这些方法了。this都是同一个context
  utils.extend(instance, Axios.prototype, context)

  // Copy context to instance
  //   把实例变量绑定到instance上，这样就可以直接使用这些方法了。this都是同一个context
  utils.extend(instance, context)

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig))
  }

  return instance
}

// Create the default instance to be exported
var axios = createInstance(defaults)
module.exports = axios
```

通过这段代码，我们了解了 axios 项目导出的变量是一个函数，且函数上挂了很多方法。

### axios 的执行流程

在 client.html 里面发送请求的代码如下：

```javascript
axios(options)
  .then(function (res) {
    response.innerHTML = JSON.stringify(res.data, null, 2)
  })
  .catch(function (res) {
    response.innerHTML = JSON.stringify(res.data, null, 2)
  })
```

我们通过上一点知道执行 axios 方法就是执 Axios 的 request 方法。那么我们来看下 request 的实现。

```javascript
Axios.prototype.request = function request(config) {
  //   此处略去对config的转换处理

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined]
  //初始化一个promise
  var promise = Promise.resolve(config)

  // 将请求的拦截去加入chain里，放到请求前
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected)
  })

  // 将拦截的请求加入chain里，放到请求后
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected)
  })

  //对chain里的依次执行promise.then，形成一个promise链
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift())
  }

  // 返回promise，我们在业务代码里继续写.then就可以对response进行业务处理。
  return promise
}
```

上面代码的执行效果是什么样呢？我们继续往下看。

### promise 链

仿照 request 函数的实现，我写了如下 demo 代码。

```javascript
var send = [
  function dispatchRequest(config) {
    console.log('config')
    return new Promise(function test(res, rej) {
      res(config)
    }).then((res) => {
      console.log('config then', res)
    })
  },
  undefined,
]

const request = [
  function requestResolve(config) {
    console.log('request')
    return Promise.resolve(config)
  },
  undefined,
]

const response = [
  function responseResolve(config) {
    console.log('response')
    return Promise.resolve(config)
  },
  undefined,
]

const chain = [...request, ...send, ...response]

var promise = Promise.resolve({
  name: 'test',
})

while (chain.length) {
  promise = promise.then(chain.shift(), chain.shift())
}
console.log('promise', promise)
```

执行后打印如下：

```javascript
promise Promise { <pending> }
request { name: 'test' }
config { name: 'test' }
config then { name: 'test' }
response { name: 'test1' }
```

可以看到 promise 的打印结果是同步的。promise.then 的执行是异步的。

其实上面的 while 循环就是拼接 promise 链。上面的代码和下面的代码执行效果是一样的。

```javascript
const promise = Promise.resolve({
  name: 'test',
})
  .then(function requestResolve(config) {
    console.log('request', config)
    return Promise.resolve(config)
  })
  .then(function dispatchRequest(config) {
    console.log('config', config)
    return new Promise(function test(res, rej) {
      res(config)
    }).then((res) => {
      console.log('config then', res)
      return {
        ...res,
        name: 'test1',
      }
    })
  })
  .then(function responseResolve(config) {
    console.log('response', config)
    return Promise.resolve(config)
  })

console.log('promise', promise)
```

axios 把请求前、发送请求、请求后做成 3 部分，顺序执行，用户可以在请求前和请求后增加自定义拦截器来对请求做处理。这样整个请求的处理过程就非常的清晰了。

### 真正发送请求:dispatchRequest

```javascript
module.exports = function dispatchRequest(config) {
// 判断是否要取消请求
  throwIfCancellationRequested(config)

// 省略对config的格式处理的代码

  var adapter = config.adapter || defaults.adapter

//   这里是真正发送请求的地方
  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config)

      // Transform response data
      response.data = transformData(response.data, response.headers, config.transformResponse)

      return response
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config)

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          )
        }
      }

      return Promise.reject(reason)
    }
  )
}
```

可以看到adapter可以是用户自定义的，没有就走axios默认提供的。

```javascript
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}
```
这里可以看到，根据运行环境，是浏览器还是node侧，返回了不同的实现。

浏览器侧通过对XMLHttpRequest的事件封装来处理请求。node侧通过node的api,https或http等来实现请求。

到这里，axios的整个流程就已经结束了。再来总结下，主要流程：

![主要流程](https://picasso-static.xiaohongshu.com/fe-platform/cb7815d49136d4df18443247e57e84f8932081b6.png)

## 在业务中的封装

在业务项目中，我们我们可以针对axios做哪些通用的封装处理呢？

### 自定义请求

axios提供了默认的发送请求的方式。如果我们在移动APP里发送请求，可以借助js bridge提供的请求方法来发送请求。

同时也需要对bridge方法的状态码和入参添加通用的拦截器，进行统一的格式化处理。

### 请求追踪ID生成

当我们要追溯一个请求都经过哪些服务时，需要在源头生成一个ID，并且在一层层传下去。

### 入参出参的转换

1. 状态码的通用转换
2. 提供对参数的驼峰与下划线的互相转换方法
3. 自定义某些错误

### 反爬处理

当我们知道是来自非正常的请求后，可以跳转到验证页面或进行其他反爬逻辑处理。

### 重新处理拦截器的执行顺序

当有多个请求拦截器或响应拦截机器，axios的实现框定了他们的执行顺序。

我们可以在axios的基础上，封装自己的拦截器的执行顺序。

## 总结

最近有空阅读了下axios中的代码，发现代码竟然挺好读的。推荐没有读过的小伙伴可以看看实现代码，加强对axios的理解。本文只介绍了axios的主线流程，还有很多没有涉及到的点，比如请求的取消的具体逻辑，也欢迎小伙们评论和交流。

