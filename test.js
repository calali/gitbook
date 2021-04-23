
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => {
    return (...args) => {
      return a(b(...args))
    }
  });
}

let sayHello = (...str) => `Hello , ${str.join(" And ")}`;
let toUpper = str => str.toUpperCase();
let replace = str => str.replace('a','replace');
// let combin = compose(
//   sayHello,
//   toUpper,
//   replace
// );

// console.log('combin', combin);

const d = [sayHello,
  toUpper,
  replace].reduce((a,b)=>{
    console.log(a,b);
    return c = (...params)=>{
      return a(b(...params))
    }
  })

console.log(d);

console.log(combin('alice')); //Hello , REPLACELICE
