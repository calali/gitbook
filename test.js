


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
