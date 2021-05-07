// 假设有一台本地机器，无法做加减乘除运算（包括位运算），因此无法执行 a + b、a + = 1 这样的 JS 代码，
// 然后我们提供一个服务器端的 HTTP API，可以传两个数字类型的参数，响应结果是这两个参数的和，
// 这个 HTTP API 的 JS SDK（在本地机器上运行）的使用方法如下：

asyncAdd(3, 5, (err, result) => {
  console.log(result); // 8
});
// 现在要求在本地机器上实现一个 sum 函数，支持以下用法：

(async () => {
  const result1 = await sum(1, 4, 6, 9, 2, 4);
  const result2 = await sum(3, 4, 9, 2, 5, 3, 2, 1, 7);
  const result3 = await sum(1, 6, 0, 5);
  console.log([result1, result2, result3]); // [26, 36, 12]
})();
// 要求 sum 能在最短的时间里返回以上结果


async function sum(...params) {
  //只要还有没有计算的分组
  let group = parseInt(params / 2,10)
  let result = 0
  while (group){
    const promiseList = new Array(group).map((item,index)=>{
      return asyncAdd
    })
    const res = await Promise.all([])
  }
}



//考点一，异步循环
//考点二，最快
