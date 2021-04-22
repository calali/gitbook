# 从一道面试题谈谈函数柯里化

## 面试题

面试中，面试官问，如何实现 add(1)(2)(3)=6 ？

稍一思索，写出如下代码：

```javascript

function add(a) {
    return function (b) {
        return function (c) {
            return a + b + c
        }
    }
}
```

面试官继续追问，那如果add后面的参数个数是100个呢？

顿时发现事情没那么简单，这里就需要柯里化来实现，咱们继续往下看。

### 函数柯里化的实现

函数柯里化含义是把接收多个参数的函数变换成接收一个单一参数的函数。

举个例子，add函数接收3个参数。

```javascript
function add(a,b,c) {
    return a + b + c
}
```

把add函数变成接收一个单一参数的函数。

```javascript

function add(a) {
    return function (b) {
        return function (c) {
            return a + b + c
        }
    }
}
```

那么如何做到对任何一个多参数函数a，都能返回这样的一个接收一个单一参数的函数呢b？我们需要实现一个curry函数。

curry 函数的参数是函数a。返回一个函数b。当b的参数数量还不够a的参数数量时，认为函数a还不能执行，继续收集参数。直至参数数量达到目标数量后中执行函数a。

```javascript
var curry = fn => {
   return  judge = (...args) => {
       return args.length === fn.length
            ? fn(...args)
            : (arg) => judge(...args, arg) //参数数量还不够，继续收集参数
   }

}

```

利用上面这个curry函数我们再来看add函数的实现

```javascript
const add = curry((a,b,c)=>{
  return a+b+c
})

console.log(add(1)(2)(3)) //6
console.log(add(1,2)(3)) //6
```

满足要求。即使add传100个参数也OK。

#### 函数柯里化的应用/优点

##### 参数复用

curry后的add函数，每次执行后返回的函数，包裹了一部分参数，实现了这些参数复用。

##### 延迟运行

fn并不直接执行，而是经过curry处理后逐步获取参数再执行。

#### 为什么面试要问函数柯里化？

#### 相关领域

函数式编程？
高阶函数？
纯函数？

#### 参考文档

<https://zh.wikipedia.org/zh/%E6%9F%AF%E9%87%8C%E5%8C%96>
<https://github.com/mqyqingfeng/Blog/issues/42>
