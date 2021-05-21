# 订阅发布模式

## 什么是订阅发布模式
订阅发布模式定义了一种 一对多 的依赖关系，

## 优势
订阅发布模式旨在降低系统不同模块之间的耦合度。


## 如何实现
```javascript
// 创建一个订阅中心
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

## 进一步优化
1多个订阅者
2取消事件订阅
https://juejin.cn/post/6844903616172539917

## 使用场景
微信公众号

## 和观察者模式的区别
https://www.cnblogs.com/onepixel/p/10806891.html
https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/25

## 参考资料
1. https://juejin.cn/post/6844903629971783693
2. https://juejin.cn/post/6850418109862576136