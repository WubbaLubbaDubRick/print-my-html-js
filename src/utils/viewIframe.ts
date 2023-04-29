import {DirectiveBinding} from "vue/types/options";
import {type2unit} from "./type2unit";
import {viewHtml} from "./viewHtml";
import {getAttribute} from "./getAttribute";
import {getAttributeType, Type2unit1, ViewHtml} from "../interface";

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
    const attributeResult = getAttribute(dom);
    if (attributeResult.error !== undefined) {
        console.error(attributeResult.error)
        return;
    }
    const { type, justifyContent, alignItems, printScale } = attributeResult as getAttributeType;

    // 之前的iframe删除  ======== Start
    const oldIframe = document.getElementById('iframe');
    if (oldIframe) {
        oldIframe.remove();
    }
    // 之前的iframe删除  ======== End

    // 获取iframe宽高
    let type2unit1: Type2unit1 = type2unit({ dom, type });

    // 创建iframe  ======== Start
    const iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'display: none;')
    iframe.setAttribute('id', 'iframe')
    iframe.setAttribute('frameborder', 'no')
    iframe.setAttribute('border', 'none')

    if (type === 'custom') {
        iframe.setAttribute('width', type2unit1.width + 'px')
        iframe.setAttribute('height', type2unit1.height + 'px')
    }
    document.body.appendChild(iframe)
    // 创建iframe  ======== End

    // console.log(iframe)
    let doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);

    if (!doc) return;

    // doc默认样式
    let style = `display: flex; flex-wrap: wrap; justify-content: ${ justifyContent }; align-items: ${ alignItems }`;
    doc.body.setAttribute('style', style);

    // 打印时去掉页眉页脚
    if (type === 'custom') {
        doc.write(`
            <style media="print">@page {
                size: ${ type2unit1.printWidth + 'mm' } ${ type2unit1.printHeight + 'mm' };
                margin: 0;
                padding: 0;
                border: none;
            }
            </style>
        `)
    }

    doc.close();

    const ViewHtmlData: ViewHtml = { doc, type2unit1, binding, type, printScale }
    // 获取HTML转Canvas的dom
    await viewHtml(ViewHtmlData);

    // 开始打印iframe内容
    if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
}
