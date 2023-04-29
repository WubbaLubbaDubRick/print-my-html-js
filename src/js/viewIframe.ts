import {DirectiveBinding} from "vue/types/options";
import {viewHtml} from "./viewHtml";
import {getAttribute} from "./getAttribute";
import {getAttributeType, ViewHtml} from "../interface";

/**
 * 创建iframe用来做打印，需要获取binding中绑定的dom id来获取需要打印的dom
 * @param binding
 * @returns {Promise<void>}
 */
export async function iframePrint(binding: DirectiveBinding) {
    const dom = document.getElementById(binding.value);

    if (!dom) {
        console.error(`Cannot find element with id: ${binding.value}`);
        return;
    }

    // 获取 id 对应的 dom 上的属性
    const attributeResult = getAttribute(dom) as getAttributeType;
    if (attributeResult.error !== undefined) {
        console.error(attributeResult.error)
        return;
    }

    // 之前的iframe删除  ======== Start
    const oldIframe = document.getElementById('iframe');
    if (oldIframe) {
        oldIframe.remove();
    }
    // 之前的iframe删除  ======== End

    // 创建iframe  ======== Start
    const iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'display: none;')
    iframe.setAttribute('id', 'iframe')
    iframe.setAttribute('frameborder', 'no')
    iframe.setAttribute('border', 'none')

    if (attributeResult.type === 'custom') {
        iframe.setAttribute('width', attributeResult.width + 'px')
        iframe.setAttribute('height', attributeResult.height + 'px')
    }
    document.body.appendChild(iframe)
    // 创建iframe  ======== End

    // console.log(iframe)
    let doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);

    if (!doc) return;

    // 打印时去掉页眉页脚
    if (attributeResult.type === 'custom') {
        doc.write(`
            <style media="print">@page {
                size: ${ attributeResult.printWidth + 'mm' } ${ attributeResult.printHeight + 'mm' };
                margin: 0;
                padding: 0;
                border: none;
            }
            </style>
        `)
    }

    // doc默认样式
    let style = `body {
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: ${ attributeResult.justifyContent };
        align-items: ${ attributeResult.alignItems };
    }`;
    const style1 = document.createElement('style');
    style1.innerHTML = style;
    doc.head.appendChild(style1);

    doc.close();

    const ViewHtmlData: ViewHtml = { doc, binding, attributeResult }
    // 获取HTML转Canvas的dom
    await viewHtml(ViewHtmlData);

    // 开始打印iframe内容
    if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
}
