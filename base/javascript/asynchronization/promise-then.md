# 一步步实现promise的链式调用

## 请看以下测试用例
```javascript
new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  }).then(res => {
    // 返回一个普通值
    return '这里返回一个普通值'
  }).then(res => {
    console.log(res) //1秒后打印出：这里返回一个普通值
  })
```

## 分析实现链式调用
1. promise支持then的链式调用。我们知道promise的实例有then的方法，因此我们在每个then函数里，继续返回new Promise，这样下一个then就可以使用新返回的new Promise的then方法，从而实现链式调用。

2. 第一个then执行时，订阅了第一个promise的fullfilled状态。即当第一个promise状态变成fullfilled时，执行第一个then的onFullfilled回调。
  
3. 第一个then的回调执行，对第二个then是有影响的。影响一是第二个then消费第一个then的返回值；影响二是第一个then执行完毕后，即第二个then要开始执行。即第二个then订阅的promise的状态发生了改变。

4. 因此我们可以分析出，then函数具有承上启下的功能。承上:上一个promise状态发生改变后，调用then里的对应方法；启下：then里的方法执行后，会影响返回的new Promise的状态。

## 代码实现
```javascript
then(onFulfilled=undefined,onRejected=undefined){
        return new MyPromise((resolveNext,rejectNext)=>{
            //承上启下的函数，因此得包装一层，不能直接this._onFulfilledArr.push(onFulfilled)
            const newOnFullfilled = (val)=>{
                const res = onFulfilled(val)
                resolveNext(res)
            }
            const newOnRejected = (reason)=>{
                const res = onRejected(reason)
                rejectNext(res)
            }
            this._onFulfilledArr.push(newOnFullfilled) //新的订阅者
            this._onRejectedArr.push(newOnRejected)
        })
    }
```

## 如果then返回的是一个promise

```javascript
new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  }).then(res => {
    // 返回一个Promise对象
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
       resolve('这里返回一个Promise')
      }, 2000)
    })
  }).then(res => {
    console.log(res) //3秒后打印出：这里返回一个Promise
  })
```

需要等待第一个then返回的是一个promise执行完毕后，再执行第二个then。

then函数修改如下：

```javascript
then(onFulfilled=undefined,onRejected=undefined){
        return new MyPromise((resolveNext,rejectNext)=>{
            //承上启下的函数，因此得包装一层，不能直接this._onFulfilledArr.push(onFulfilled)
            const newOnFullfilled = (val)=>{
                const res = onFulfilled(val)
                if(res instanceof MyPromise){
                    res.then(resolveNext,rejectNext)
                }else{
                    resolveNext(res)
                }
            }
            const newOnRejected = (reason)=>{
                const res = onRejected(reason)
                if(res instanceof MyPromise){
                    res.then(resolveNext,rejectNext)
                }else{
                    resolveNext(res)
                }
                
            }
            this._onFulfilledArr.push(newOnFullfilled) //订阅者
            this._onRejectedArr.push(newOnRejected)
        })
    }
```

## 如果then中抛出了异常

```javascript
new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    }, 1000)
  }).then(res => {
    throw new Error('这里抛出一个异常e')
  }).then(res => {
    console.log(res)
  }, err => {
    console.log(err) //1秒后打印出：这里抛出一个异常e
  })
```

第一个then中的异常会直接将下一个then的回调执行onRejected。

then函数修改如下：

```javascript
 then(onFulfilled=undefined,onRejected=undefined){
        return new MyPromise((resolveNext,rejectNext)=>{
            //承上启下的函数，因此得包装一层，不能直接this._onFulfilledArr.push(onFulfilled)
            const newOnFullfilled = (val)=>{
                try {
                    const res = onFulfilled(val)
                    if(res instanceof MyPromise){
                        res.then(resolveNext,rejectNext)
                    }else{
                        resolveNext(res)
                    }
                    
                } catch (error) {
                    rejectNext(error)
                }
            }
            const newOnRejected = (reason)=>{
                try {
                    const res = onRejected(reason)
                    if(res instanceof MyPromise){
                        res.then(resolveNext,rejectNext)
                    }else{
                        rejectNext(res)
                    }
                } catch (error) {
                    rejectNext(error)
                }
            }
            this._onFulfilledArr.push(newOnFullfilled) //订阅者
            this._onRejectedArr.push(newOnRejected)
        })
    }
```

## 如果then函数的参数不是函数

```javascript
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    }, 1000)
  })
  .then('这里的onFulfilled本来是一个函数，但现在不是')
  .then(res => {
    console.log(res) // 1秒后打印出：success
  }, err => {
    console.log(err)
  })
```

第二个then直接获取上上一个promise的返回值。

then函数修改如下：

```javascript
 then(onFulfilled=undefined,onRejected=undefined){
        return new MyPromise((resolveNext,rejectNext)=>{
            //承上启下的函数，因此得包装一层，不能直接this._onFulfilledArr.push(onFulfilled)
            const newOnFullfilled = (val)=>{
                try {
                    if(typeof onFulfilled === 'function'){
                        const res = onFulfilled(val)
                        if(res instanceof MyPromise){
                            res.then(resolveNext,rejectNext)
                        }else{
                            resolveNext(res)
                        }
                    }else{
                        resolveNext(val)
                    }
                } catch (error) {
                    rejectNext(error)
                }
            }
            const newOnRejected = (reason)=>{
                try {
                    if(typeof onRejected === 'function'){
                        const res = onRejected(reason)
                        if(res instanceof MyPromise){
                            res.then(resolveNext,rejectNext)
                        }else{
                            rejectNext(res)
                        }
                    }else{
                        rejectNext(reason)
                    }
                } catch (error) {
                    rejectNext(error)
                }
            }
            this._onFulfilledArr.push(newOnFullfilled) //订阅者
            this._onRejectedArr.push(newOnRejected)
        })
    }
```

## 参考资料
1. https://juejin.cn/post/6883121706123132936
2. https://juejin.cn/post/6844903665686282253