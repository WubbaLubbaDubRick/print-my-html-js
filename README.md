# print-my-html-js
打印指定HTML代码块，且支持设置打印文件页面大小。

## main.js引入
```
import printMyHtmlJs from 'print-my-html-js'
Vue.use(printMyHtmlJs)
```
## id="print" 里是需要打印的内容
* ### _参数_
* #### _打印样式：type {String}_
  * custom：自定义打印样式
  * default：默认打印样式（默认）
* #### _水平排列方式：justifyContent {String}_
  * start：左偏移（默认）
  * center：水平居中
  * end：右偏移
* #### _纵向排列方式：alignItems {String}_
  * start：上偏移（默认）
  * center：纵向居中
  * end：下偏移
* #### _打印宽度：printWidth {String}_  (type="custom"时有效)
  * 210（默认：被打印Dom 宽度）
* #### _打印高度：printHeight {String}_  (type="custom"时有效)
  * 297（默认：被打印Dom 高度）
* #### _打印清晰度：printScale {String}_
  * 1（默认）
```
<div id="print" type="custom" printWidth="60" printHeight="40">
  <div class="font-size: 20px;" style="color: red;">
    我是要被打印的内容
  </div>
</div>
```
## v-print-html="'print'" 是触发打印按钮
* #### _【'print'】与打印DOM ID对应_
```
<el-button v-print-html="'print'">打印</el-button>
```
