# print-my-html-js
打印指定HTML代码块，且支持设置打印文件页面大小。

## main.js引入
```
import printMyHtmlJs from 'print-my-html-js'
Vue.use(printMyHtmlJs)
```
## id="print" 里是需要打印的内容
* ### _参数_
* #### _打印类型：type {String}_
    * 例：
        * 默认不填(打印默认样式)
        * px(像素单位)
        * mm(长度单位)
* #### _打印宽度：printWidth {String}_
  * 例：60
* #### _打印高度：printHeight {String}_
  * 例：40
```
<div id="print" type="mm" printWidth="60" printHeight="40">
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
