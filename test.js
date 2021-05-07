
Function.prototype.call = function (context, ...args) {
  context = context === undefined || context === null ? window : Object(context)
  const fn = Symbol('fn')
  context[fn] = this
  context[fn](...args)
}

function greet() {
  var reply = [this.animal, 'typically sleep between', this.sleepDuration].join(' ');
  console.log(reply);
}

var obj = {
  animal: 'cats', sleepDuration: '12 and 16 hours'
};

greet.call(obj);  // cats typically sleep between 12 and 16 hours


var context = {
  bar: 2
}

function Foo() {
  this.bar = 'new bar'
}

var FooWithContext = Foo.bind(context);
var foo = new FooWithContext();

// 考虑下面代码的输出
console.log(foo.bar)
console.log(context.bar)

// 结果是：new bar 2
/**
  * 我们可以发现虽然将使用bind函数将this绑定到context上，
  * 但被new调用的Foo，他的this并没有绑定到context上。
  */
