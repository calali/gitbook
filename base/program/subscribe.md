# 观察者模式

## 什么是观察者模式

观察者模式定义了一种 一对多 的依赖关系，一是指被观察者，负责发布事件，多是指观察者，可以有多个观察者订阅某一个事件。当事件触发的时候，观察者获得通知。

观察者模式广泛存在于前端，比如事件触发，vue组件生命周期的触发，vue watch触发，nodejs里的事件处理。

观察者模式旨在降低系统不同模块之间的耦合度，在各自内部模块互相不耦合。


## 实现

### 基本实现

```javascript
class EventBus {
  constructor() {
    this.obj = {}
  }
  on(key, fn) {
    this.obj[key] = fn;
  }
  emit(key, value) {
    this.obj[key].call(this, value);
  }
}

let eventBus = new EventBus();
// 订阅一个name为test1的事件
eventBus.on('test1', (val) => {
  console.log('test1', 'value:' + val)
});
// 订阅一个name为test2的事件
eventBus.on('test2', function (val) {
  console.log('test2', 'value:' + val)
});

setTimeout(() => {
  // 触发test1
  eventBus.emit('test1', 1)
  // 触发test2
  eventBus.emit('test2', 2)
}, 1000)
```

### 进一步优化:支持多个观察者

```javascript
class EventBus {
  constructor() {
    this.obj = {}
  }
  on(key, fn) {
    if(this.obj[key] === undefined){
      this.obj[key] = []
    }
    this.obj[key].push(fn)
  }
  emit(key, value) {
    this.obj[key].map(fn=>{
      fn.call(this, value);
    })
  }
}

let eventBus = new EventBus();
// 订阅一个name为test1的事件
eventBus.on('test1', (val) => {
  console.log('test1', 'value:' + val+ ' 1')
});
eventBus.on('test1', (val) => {
  console.log('test1', 'value:' + val + ' 2')
});
// 订阅一个name为test2的事件
eventBus.on('test2', function (val) {
  console.log('test2', 'value:' + val)
});

setTimeout(() => {
  // 触发test1
  eventBus.emit('test1', 1)
  // 触发test2
  eventBus.emit('test2', 2)
}, 1000)
```

### 再一步优化:支持取消事件订阅

```javascript
class EventBus {
  constructor() {
    this.obj = {}
  }
  on(key, fn) {
    if(this.obj[key] === undefined){
      this.obj[key] = []
    }
    this.obj[key].push(fn)
  }
  emit(key, value) {
    this.obj[key].map(fn=>{
      fn.call(this, value);
    })
  }
  off(key,value){
    if(typeof value === 'function' && this.obj[key]){
      const index = this.obj[key].findIndex(fn=>fn === value)
      if(index !== -1){
        this.obj[key].splice(index)
      }
    }
  }
}

let eventBus = new EventBus();
// 订阅一个name为test1的事件

const fn1 = (val) => {
  console.log('test1', 'value:' + val + ' 1')
}
eventBus.on('test1', fn1);
eventBus.on('test1', (val) => {
  console.log('test1', 'value:' + val + ' 2')
});
;
// 订阅一个name为test2的事件
eventBus.on('test2', function (val) {
  console.log('test2', 'value:' + val)
});

setTimeout(() => {
  // 触发test1
  eventBus.emit('test1', 1)
  // 触发test2
  eventBus.emit('test2', 2)

  eventBus.off('test1', fn1)

  eventBus.emit('test1', 1)

}, 1000)
```

## 和订阅发布模式的区别

观察者-被观察者，重点是被观察者。

订阅者-发布者-订阅发布中心，重点是订阅发布中心。

## 参考资料
1. https://juejin.cn/post/6844903629971783693
2. https://juejin.cn/post/6850418109862576136
3. https://juejin.cn/post/6844903616172539917
4. https://juejin.cn/post/6978728619782701087
