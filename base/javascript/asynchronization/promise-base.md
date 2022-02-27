# promise基础版本

## 请看以下测试用例
```javascript
const a = new MyPromise((res,rej)=>{
    setTimeout(()=>{
        res('a')
    },1000)
})

a.then(res=>{
    console.log('1',res);
})

a.then(res=>{
    console.log('11',res);
})

const b = new MyPromise((res,rej)=>{
    rej('b')
})

b.then(undefined,res=>{
    console.log('2',res);
})

b.then(undefined,res=>{
    console.log('22',res);
})
```

执行结果应该是：

```javascript
2 b
22 b
1 a
11 a
```

## 分析MyPromise的实现思路

1. 首先MyPromise应当是一个构造函数，即一个类。
2. 实例化调用时，它的入参是一个函数，称为executor。executor函数有2个参数，分别是res和rej。当res被调用时，MyPromise的状态从pending变成fulfilled，当rej被调用时，MyPromise的状态从pending变成rejected。
3. MyPromise的状态改变是不可逆的。
4. 当状态发生改变时，执行then里的对应的方法。
5. then的参数有两个，分别是onFulfilled和onRejected。MyPromise变成fulfilled时，执行onFulfilled。MyPromise变成rejected时，执行onRejected。
6. 一个MyPromise可以注册多个then，他们在MyPromise状态改变时，都会被执行。
7. then的实现可以理解为发布-订阅模式。then中的回调函数是订阅者，订阅了MyPromise不同状态。MyPromise的executor中的res和rej是发布者，改变了MyPromise状态。

## 实现MyPromise

```javascript
class MyPromise {
    constructor(executor){
        //executor不是函数则报错
        if(typeof executor !== 'function'){
            throw new Error('MyPromise需要传入一个函数')
        }
        try {
            //TODO 为什么这里要bind??
            setTimeout(()=>{
                executor(this.resolve.bind(this),this.reject.bind(this))
            },0)
        } catch (error) {
            this.reject(error)
        }
    }

    _status = 'pending'

    _value = undefined

    _reason = undefined

    _onFulfilledArr = []

    _onRejectedArr = []

    then(onFulfilled=undefined,onRejected=undefined){
        this._onFulfilledArr.push(onFulfilled)
        this._onRejectedArr.push(onRejected)
    }

    resolve(value){
        if(this._status === 'pending'){
            this._status = 'fulfilled'
            this._value = value

            let cb

            while (cb=this._onFulfilledArr.shift()) {
                cb(value)
            }
        }
    }

    reject(reason){
        if(this._status === 'pending'){
            this._status = 'rejected'
            this._reason = reason

            let cb

            while (cb=this._onRejectedArr.shift()) {
                cb(reason)
            }
        }
    }
}
```

