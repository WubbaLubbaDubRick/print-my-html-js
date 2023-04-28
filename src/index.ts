import Vue from 'vue';
import { VueConstructor } from 'vue/types/vue';
import html2canvas from "html2canvas";
import {DirectiveBinding} from "vue/types/options";

import { Type2UnitOptions, Type2unit1, ViewHtml } from "./interface";

const install = (Vue: VueConstructor) => {
    Vue.directive('print-html', {
        bind: function (el, binding) {
            el.onclick = async function () {
                // 需要获取binding中绑定的dom id来获取需要打印的dom
                await viewIframe(binding);
            }
        },
        // unbind(el, binding, vnode) {}
        unbind() {}
    })
};

/**
 * 创建iframe用来做打印，需要获取binding中绑定的dom id来获取需要打印的dom
 * @param binding
 * @returns {Promise<void>}
 */
async function viewIframe(binding: DirectiveBinding) {
    const dom = document.getElementById(binding.value);

    if (!dom) {
        console.error(`Cannot find element with id: ${binding.value}`);
        return;
    }

    // 打印宽度
    let printWidth: number = parseInt(dom.getAttribute('printWidth') || '0');
    // 打印高度
    let printHeight: number =  parseInt(dom.getAttribute('printHeight') || '0');
    // 打印类型
    const type: string = dom.getAttribute('type') || 'mm';

    // 之前的iframe删除  ======== Start
    const oldIframe = document.getElementById('iframe');
    if (oldIframe) {
        oldIframe.remove();
    }
    // 之前的iframe删除  ======== End

    // 宽高转化
    let type2unit1 = type2unit({ printWidth, printHeight, dom, type });

    // 创建iframe  ======== Start
    const iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'display: none;')
    iframe.setAttribute('id', 'iframe')
    iframe.setAttribute('frameborder', 'no')
    iframe.setAttribute('border', 'none')

    iframe.setAttribute('width', type2unit1.width + 'px')
    iframe.setAttribute('height', type2unit1.height + 'px')
    document.body.appendChild(iframe)
    // 创建iframe  ======== End

    // console.log(iframe)
    let doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);

    if (!doc) return;

    // 打印时去掉页眉页脚
    if (type === 'mm' || type === 'px') {
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

    // 获取HTML转Canvas的dom
    await viewHtml({ doc, type2unit1, binding });

    // 开始打印iframe内容
    if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
}

/**
 * mm/px 互转     mm：毫米   px：像素
 * @param option
 * @returns {*&{width: number, height: number}}
 * width、height：单位px
 * printWidth、printHeight：单位mm
 */
function type2unit(option: Type2UnitOptions) {
    const Type2unit1: Type2unit1 = {
        width: 0,
        height: 0,
        printWidth: 0,
        printHeight: 0,
    }

    if (option.type === 'px') {
        Type2unit1.width = option.printWidth
        Type2unit1.height = option.printHeight
        Type2unit1.printWidth = Math.floor(new UnitConversion().pxConversionMm(option.printWidth))
        Type2unit1.printHeight = Math.floor(new UnitConversion().pxConversionMm(option.printHeight))
    } else {
        Type2unit1.width = Math.floor(new UnitConversion().mmConversionPx(option.printWidth))
        Type2unit1.height = Math.floor(new UnitConversion().mmConversionPx(option.printHeight))
        Type2unit1.width = option.printWidth
        Type2unit1.height = option.printHeight
    }
    return {
        ...Type2unit1
    }
}


// HTML转Canvas
async function viewHtml(ViewHtml: ViewHtml) {
    // doc, type2unit1, binding
    const targetDom: HTMLElement | null = document.getElementById(ViewHtml.binding.value);

    let tableCanvas: HTMLCanvasElement = new HTMLCanvasElement();
    try {
        if (targetDom) {
            tableCanvas = await html2canvas(targetDom, {
                scale: 6
            });
        }
    } catch (error) {
        console.log(error, 'error');
    }

    tableCanvas.style.width = ViewHtml.type2unit1.width + 'px';
    // mm 打印 height有1px误差
    tableCanvas.style.height = (ViewHtml.type2unit1.height - 1) + 'px';

    ViewHtml.doc.body.style.margin = 0;
    ViewHtml.doc.body.style.padding = 0;

    ViewHtml.doc.body.appendChild(tableCanvas);
}

// mm/px互转计算
class UnitConversion {
    /**
     * 获取DPI
     * @returns {number[]}
     */
    conversion_getDPI(): number[] {
        const arrDPI: number[] = [];
        if ((window.screen as any).deviceXDPI) {
            arrDPI[0] = (window.screen as any).deviceXDPI;
            arrDPI[1] = (window.screen as any).deviceYDPI;
        } else {
            const tmpNode: HTMLElement | null = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = tmpNode.offsetWidth;
            arrDPI[1] = tmpNode.offsetHeight;
            if (tmpNode.parentNode) {
                tmpNode.parentNode.removeChild(tmpNode);
            }
        }
        return arrDPI;
    }

    /**
     * px转换为mm
     * @param value
     * @returns {number}
     */
    pxConversionMm(value: number): number {
        const inch = value / this.conversion_getDPI()[0];
        return inch * 25.4;
    }

    /**
     * mm转换为px
     * @param value
     * @returns {number}
     */
    mmConversionPx(value: number): number {
        const inch = value / 25.4;
        return inch * this.conversion_getDPI()[0];
    }
}


if (typeof window !== 'undefined' && Vue) {
    install(<VueConstructor>Vue);
}

export default {
    install,
};
