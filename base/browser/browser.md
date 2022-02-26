# 当我们输入在浏览器中输入URL，浏览器里发生了什么？

根据URL导航到新的页面，主要流程是网络请求和页面渲染。
## 网络请求过程

### DNS查找
通过DNS服务器，找到域名对应服务器的IP地址。

### 与服务器建立连接
浏览器就会通过TCP”三次握手“与服务器建立连接。

### TLS 协商
出于安全考虑考虑，大部分网页会使用https协议。

### 响应
“Time to First Byte” (TTFB)是用户通过点击链接进行请求与收到第一个HTML包之间的时间。第一块内容通常是14kb的数据。

一旦浏览器收到数据的第一块，它就可以开始解析收到的信息。“推测性解析”，“解析”是浏览器将通过网络接收的数据转换为DOM和CSSOM的步骤，通过渲染器把DOM和CSSOM在屏幕上绘制成页面。

## 浏览器渲染流程：关键渲染路径

### 1构建DOM
第一步是处理HTML标记并构造DOM树。

遇到非阻塞资源，如图片，浏览器会请求这些资源并且继续解析。遇到一个CSS文件时，解析也可以继续进行。
遇到阻塞资源，如没有 async 或者 defer 属性的js代码或文件，会阻塞渲染并停止HTML的解析。

预加载扫描仪将解析可用的内容并请求高优先级资源，如CSS、JavaScript和web字体。它将在后台检索资源，以便在主HTML解析器到达请求的资源时，它们可能已经在运行，或者已经被下载。

### 2构建CSSOM树
第二步是处理CSS并构建CSSOM树。

### 3构建Rendering Tree
第三步是将DOM和CSSOM组合成一个Render树，计算样式树或渲染树从DOM树的根开始构建，遍历每个可见节点。


### 4布局
第四步是在渲染树上运行布局以计算每个节点的几何体。布局是确定呈现树中所有节点的宽度、高度和位置，以及确定页面上每个对象的大小和位置的过程。回流是对页面的任何部分或整个文档的任何后续大小和位置的确定。

### 5绘制
将各个节点绘制到屏幕上，第一次出现的节点称为first meaningful paint。

为了确保流畅渲染：平滑滚动和动画，占据主线程的所有内容，js代码，以及回流和绘制，必须让浏览器在16.67毫秒内完成。

绘制可以将布局树中的元素分解为多个层。将内容提升到GPU上的层（而不是CPU上的主线程）可以提高绘制和重新绘制性能。

有自己单独层的元素：video、canvas、任何CSS属性为opacity、3D转换、will-change的元素。

当文档的各个部分以不同的层绘制，相互重叠时，必须进行合成，以确保它们以正确的顺序绘制到屏幕上，并正确显示内容。

## 交互
### 重绘和回流

回流：重新布局。改变尺寸及位置会引发回流。display：none会引发回流和重绘，因为页面的布局和颜色改变了。

重绘：重新绘制。改变颜色背景、visibility会引发重绘。

回流必将引起重绘，重绘不一定会引起回流。


## 参考资料
https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work
https://www.cnblogs.com/chanshuyi/p/head_first_of_dns.html
https://juejin.cn/post/6844903569087266823
https://stackoverflow.com/questions/37494330/display-none-in-a-for-loop-and-its-affect-on-reflow
https://juejin.cn/post/6844904046411644941
