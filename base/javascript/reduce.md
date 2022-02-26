# reduce

## reduce是什么

数组的一个方法，可以对数组进行累计处理。

reduce函数有2个参数，第一个是累计处理的函数callback，第二个初始累计值initialValue，可选。

### 不提供初始值
```javascript
const arr = [1,2,3]
const result = arr.reduce(function(accumulator,currentValue,currentIndex,sourceArray){
    console.log(currentIndex) 
    return accumulator + currentValue
})
console.log(result);
// 1
// 2
// 6
```
### 提供初始值
```javascript
const arr = [1,2,3]
const result = arr.reduce(function(accumulator,currentValue,currentIndex,sourceArray){
    return accumulator + currentValue
},4)
console.log(result);
```
## 实现reduce
```javascript
Array.prototype.myReduce = function(fn,initalValue){
  const arr = this
  if(!arr.length){
    throw new TypeError('Reduce of empty array with no initial value')
  }
  //不提供初始值则使用数组里的第一项
  let finalInitalValue = initalValue === undefined ? arr[0] : initalValue
  let startIndex = initalValue === undefined ? 1 : 0
  
  let result = finalInitalValue
  arr.slice(startIndex).map((value)=>{
    result = fn(result,value,startIndex,arr)
    startIndex+=1
  })
  return result
}


const arr = [1,2,3]
const result = arr.myReduce(function(accumulator,currentValue,currentIndex,sourceArray){
  console.log(currentIndex)
  return accumulator + currentValue
})
console.log(result);
// 1
// 2
// 6

const result = arr.myReduce(function(accumulator,currentValue,currentIndex,sourceArray){
  console.log(currentIndex)
  return accumulator + currentValue
},4)
console.log(result);
// 0
// 1
// 2
// 10
```



## 参考资料
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce