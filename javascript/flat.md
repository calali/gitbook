# 来说说flat的实现

## flat的用法
### flat的定义
MDN中的定义是flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```javascript
var arr1 = [1, 2, [3, 4],5,[6,[[7],8],9],10];
console.log(arr1.flat()) //[ 1, 2, 3, 4, 5, 6, [ [ 7 ], 8 ], 9, 10 ]
```

flat里面没有层数时，默认值是1。上面例子中，flat要对arr1解除1层的嵌套，从外层开始，解除了数组[3,4]和[6,[[7],8],9]的嵌套。

### flat移出空值
```javascript
var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```
### 通过Infinity全套解除嵌套
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



## 参考资料
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
https://juejin.cn/post/6844904025993773063#heading-5