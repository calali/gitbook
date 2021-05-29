

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
},4)
console.log(result);