// function add(a) {
//   return function (b) {
//     return function (c) {
//       return a + b + c
//     }
//   }
// }



var curry = fn =>{
  return judge = (...args) => {
    console.log(fn.length, args);
    return args.length === fn.length
      ? fn(...args)
      : (arg) => judge(...args, arg)
  }
}


const add = curry((a,b,c)=>{
  return a+b+c
})

console.log(add(1,2)(3));