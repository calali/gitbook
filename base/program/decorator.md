# 装饰器模式

## 什么是装饰器模式

装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。

装饰器是一种函数，写成@ + 函数名。它可以放在类和类方法的定义前面。

```javascript
function decorator (target, key, descriptor) {
  // target是装饰对象，可以是类或者类的属性
  // key是方法名
  //descriptor属性描述符:value、writable、enumerable、configurable
}
```
## 可以装饰的范围

### 类

```javascript
@testable
class MyTestableClass {
  // ...
}
function testable(target) {
  target.isTestable = true;
}
MyTestableClass.isTestable // true
```

### 类的方法

```javascript
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```

### 不能装饰函数

装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升导致装饰器不能起作用。

## 目前支持情况

ecmascript对类级别的装饰器已经进入[stage2](https://tc39.es/proposal-decorators/) 了，大概率会继续推进。

typescript支持[decorator语法](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Decorators.html)。

babel支持[decorator语法](https://babel.docschina.org/docs/en/babel-plugin-proposal-decorators/)。

vue3建议使用vue hooks、vue composition api代替decorator

## 应用

### 接口非侵入式处理：展示错误、打日志等

```javascript
// 装饰器函数
function operateToast(successInfo = '操作成功', errorInfo = '操作失败，请重试') {
  return function (target, key, descriptor) {
    const originFunc = descriptor.value;
  
    descriptor.value = function() {
      return originFunc.apply(this, arguments).then(res => {
        toast(successInfo)
        return res
      }).catch(err => {
        toast(errorInfo)
        throw err
      })
    }
    return descriptor
  }
}

// 使用装饰器
class UserApi {
  @operateToast('设置用户名称成功', '后端太垃圾了，设置用户名称接口挂了')
  static setUserName(name) {
    return setUserName(name)
  }

  @operateToast('设置用户年龄成功', '后端太垃圾了，接口又挂了')
  static setUserAge(age) {
    return setUserAge(age)
  }
}

// 调用接口
UserApi.setUserName('name')
UserApi.setUserAge(12)
```
### vue项目中弹窗、加载等重复交互
```javascript
/**
 * loading 装饰器
 * @param {*} message 提示信息
 * @param {function} errorFn 异常处理逻辑
 */
export const loading =  function(message = '加载中...', errorFn = function() {}) {
  return function(target, name, descriptor) {
    const fn = descriptor.value
    descriptor.value = async function(...rest) {
      const loading = Toast.loading({
        message: message,
        forbidClick: true
      })
      try {
        return await fn.call(this, ...rest)
      } catch (error) {
        // 在调用失败，且用户自定义失败的回调函数时，则执行
        errorFn && errorFn.call(this, error, ...rest)
        console.error(error)
      } finally {
        loading.clear()
      }
    }
  }
}
```
```javascript
export default {
  methods:{
    @loading('加载中')
    async getData() {
      try{
        const data = await loadData()
        // 其他操作
      }catch(error){
        // 异常处理
        Toast.fail('加载失败');
      }  
    }
  }
}
```

## 总结

## 参考资料
<https://www.bookstack.cn/read/es6-3rd/docs-decorator.md>
<https://zhuanlan.zhihu.com/p/27762556>
<https://juejin.cn/post/6844904030838194189>
<https://babel.docschina.org/docs/en/babel-plugin-proposal-decorators/>
<https://github.com/tc39/proposal-decorators>
https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Decorators.html
https://github.com/mqyqingfeng/Blog/issues/109
https://zhuanlan.zhihu.com/p/32856278
<https://vince.xin/2019/11/29/Decorator-%EF%BC%88%E8%A3%85%E9%A5%B0%E5%99%A8%EF%BC%89%E5%85%A5%E9%97%A8%E4%BB%A5%E5%8F%8A%E5%9C%A8%E5%89%8D%E7%AB%AF%E6%8E%A5%E5%8F%A3%E9%80%BB%E8%BE%91%E5%B1%82%E4%B8%AD%E7%9A%84%E5%AE%9E%E8%B7%B5/>
https://segmentfault.com/a/1190000023471570