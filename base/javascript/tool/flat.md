# 实现flat

## flat的用法

flat会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```javascript
var arr1 = [1, 2, [3, 4],5,[6,[[7],8],9],10];
console.log(arr1.flat()) //[ 1, 2, 3, 4, 5, 6, [ [ 7 ], 8 ], 9, 10 ]
```

flat里面没有层数时，默认值是1。上面例子中，flat要对arr1解除1层的嵌套。

### flat跳过对空值的处理
```javascript
var arr2 = new Array(3)
arr2[0] =[1]
arr2[2] = [2,[3]]

console.log(arr2); //[ [ 1 ], <1 empty item>, [ 2, [ 3 ] ] ]
console.log(arr2.flat());//[ 1, 2, [ 3 ] ]
```
### 通过Infinity解除全部嵌套
```javascript
var arr1 = [1, 2, [3, 4],5,[6,[[7],8],9],10];
console.log(arr1.flat()) 
// [
//   1, 2, 3, 4,  5,
//   6, 7, 8, 9, 10
// ]
```
## flat的实现
通过上面几点，我们了解了flat的具体用法，那么我们现在尝试来实现flat吧！

### reduce实现
```javascript
function flatten(arr, d = 1) {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val, d - 1) : val), [])
                : arr.slice();
};
var arr1 = [1, 2, [3, 4], 5, [6, [[7], 8], 9], 10];
console.log(flatten(arr1, 2))
// [
//    1, 2, 3,
//    4, 5, 6,
//    [7], 8, 9,
//    10
// ]

var arr2 = new Array(3)
arr2[0] =[1]
arr2[2] = [2,[3]]

console.log(flatten(arr2)); //[ 1, 2, [ 3 ] ]

```

### forEach实现
```javascript
// forEach 遍历数组会自动跳过空元素
const eachFlat = (arr = [], depth = 1) => {
  const result = []; // 缓存递归结果
  // 开始递归
  (function flat(arr, depth) {
    // forEach 会自动去除数组空位
    arr.forEach((item) => {
      // 控制递归深度
      if (Array.isArray(item) && depth > 0) {
        // 递归数组
        flat(item, depth - 1)
      } else {
        // 缓存元素
        result.push(item)
      }
    })
  })(arr, depth)
  // 返回递归结果
  return result;
}

var arr1 = [1, 2, [3, 4], 5, [6, [[7], 8], 9], 10];
console.log(eachFlat(arr1, 2))
// [
//    1, 2, 3,
//    4, 5, 6,
//    [7], 8, 9,
//    10
// ]

var arr2 = new Array(3)
arr2[0] =[1]
arr2[2] = [2,[3]]

console.log(eachFlat(arr2)); //[ 1, 2, [ 3 ] ]

```

### forof实现
```javascript
// for of 循环不能去除数组空位，需要手动去除
const forFlat = (arr = [], depth = 1) => {
   const result = [];
   (function flat(arr, depth) {
     for (let item of arr) {
       if (Array.isArray(item) && depth > 0) {
         flat(item, depth - 1)
       } else {
         // 去除空元素，添加非undefined元素
         item !== void 0 && result.push(item);
       }
     }
   })(arr, depth)
   return result;
 }

 var arr1 = [1, 2, [3, 4], 5, [6, [[7], 8], 9], 10];
console.log(forFlat(arr1, 2))
// [
//    1, 2, 3,
//    4, 5, 6,
//    [7], 8, 9,
//    10
// ]

var arr2 = new Array(3)
arr2[0] =[1]
arr2[2] = [2,[3]]

console.log(forFlat(arr2)); //[ 1, 2, [ 3 ] ]
```
## 参考资料
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
https://juejin.cn/post/6844904025993773063#heading-5