# 再聊聊文件下载

## 文件下载的需求

### 初步研究

业务需求中要求文件可以进行点击下载。

然后我想到了a链接不是新增了[download属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)吗？

把a链接的地址设置为要下载的图片地址，设置download属性为要下载的文件名即可。

```html
<a href="https:wwww.a.com/a/b" download="某个指定的值">
```
一番尝试，发现并没有起作用。原来是图片地址的域名和当前访问页面的域名不一致到的。文档上说明了只支持同源URL。

也就是说，这种办法在么只支持同源URL，在么只能忽略文件名下载。

## 支持自定义文件名

如何支持自定义文件名呢？
文档中有这么一句话：

>尽管 HTTP URL 需要位于同一源中，但是可以使用 blob: URL 和 data: URL ，以方便用户下载使用 JavaScript 生成的内容（例如使用在线绘图 Web 应用程序创建的照片）。

那么我们可以怎么获取文件的blob: URL呢？

需要使用[URL.createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL)。URL.createObjectURL()的入参是用“于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象”。

获取文件的Blob对象，可以通过XMLHttpRequest的[responseType为'blob'](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data)

```javascript
function getBlob(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }

    xhr.send()
  })
}

function saveAs(blob, filename) {
  const link = document.createElement('a')

  link.href = window.URL.createObjectURL(blob)
  link.download = filename

  // fix Firefox
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  window.URL.revokeObjectURL(link.href)
}

async function downloadImage (url,filename){
  const blobUrl = await getBlob(finalUrl)
  saveAs(blobUrl, img.downloadName)
}

downloadImage('https:wwww.a.com/a/b','某个指定的值')
```

这样就可以实现下载任意文件，成功！

## 其他下载方法

除了这种方法，是否还有其他的下载方法可以下载素材呢？

### 对于图片和视频，还可以使用canvas进行下载

```javascript
export function downloadImg(img) {
  return new Promise<void>(reslove => {
    const imgDom = new Image()
    imgDom.setAttribute('crossOrigin', 'Anonymous')
    imgDom.src = img.url

    imgDom.addEventListener('load', () => {
      const alink = document.createElement('a')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.width = img.width
      canvas.height = img.height
      context.drawImage(imgDom, 0, 0)

      alink.download = img.downloadName
      alink.style.display = 'none'
      alink.href = canvas.toDataURL('image/jpeg')
      alink.click()
      reslove()
    })
  })
}
```
也用到了a链接的download属性，缺点是图片会比实际体积大。在项目中就踩到了这个坑。把图片画到canvas上，图片导出时的编码是base64，这种编码导致图片体积变大约33%。

### http请求下载
[Content-Disposition: attachment; filename="filename.jpg"](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition)

放到云服务上的文件可以通过这种方式从云端直接下载和重命名。
## 参考资料
1. https://www.jianshu.com/p/6545015017c4
2. https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
3. https://stackoverflow.com/questions/4715415/base64-what-is-the-worst-possible-increase-in-space-usage
4. https://cloud.tencent.com/document/product/436/14115