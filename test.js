// async function async1() {
//   console.log('async1 start');
//   await async2();
//   console.log('async1 end');
// }
// async function async2() {
//   console.log('async2');
// }
// console.log('script start');
// setTimeout(function () {
//   console.log('setTimeout');
// }, 0)
// async1();
// new Promise(function (resolve) {
//   console.log('promise1');
//   resolve();
// }).then(function () {
//   console.log('promise2');
// });
// console.log('script end');


// 'script start'
// 'script end'

// 'async1 start'
// 'async2'
// 'async1 end'
// 'promise1'
// 'promise2'
// 'setTimeout'

// console.log('start');
// setTimeout(() => {
//   console.log('children2');
//   Promise.resolve().then(() => {
//     console.log('children3');
//   })
// }, 0);

// new Promise(function (resolve, reject) {
//   console.log('children4');
//   setTimeout(function () {
//     console.log('children5');
//     resolve('children6')
//   }, 0)
// }).then((res) => {
//   console.log('children7');
//   setTimeout(() => {
//     console.log(res);
//   }, 0)
// })

// 执行整个代码块的宏任务，打印出'start'
// 事件队列里放入34行的宏任务。
// 执行new promise, 打印出'children4'，放入43行的宏任务
// 执行宏任务，打印出'children2', 执行微任务，打印出'children3'
// 执行宏任务，打印出'children5', 执行微任务，打印出'children7'
// 执行宏任务，打印出'children6'

const p = function () {
  return new Promise((resolve, reject) => {
    const p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, 0)
      resolve(2)
    })
    p1.then((res) => {
      console.log(res);
    })
    console.log(3);
    resolve(4);
  })
}


p().then((res) => {
  console.log(res);
})
console.log('end');

产生一个宏任务，执行resolve(2),
打印3，
打印end
执行微任务，打印出2，
执行微任务 打印出4