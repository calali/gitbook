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