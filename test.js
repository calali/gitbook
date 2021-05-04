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
