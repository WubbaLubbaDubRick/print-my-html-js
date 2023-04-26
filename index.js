import Vue from 'vue';
import html2canvas from "html2canvas";

const install = Vue => {
    Vue.directive('print-html', {
        bind: function (el, binding, vnode) {
            el.onclick = async function () {
                // 需要获取binding中绑定的dom id来获取需要打印的dom
                await viewIframe(binding);
            }
        },
        unbind(el, binding, vnode) {}
    })
};

/**
 * 创建iframe用来做打印，需要获取binding中绑定的dom id来获取需要打印的dom
 * @param binding
 * @returns {Promise<void>}
 */
async function viewIframe(binding) {
    const dom = document.getElementById(binding.value);
    // 打印宽度
    let printWidth = dom.getAttribute('printWidth');
    // 打印高度
    let printHeight = dom.getAttribute('printHeight');
    // 打印类型
    const type = dom.getAttribute('type');

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
    let doc = iframe.contentDocument || iframe.contentWindow.document;

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

    doc.close()

    // 获取HTML转Canvas的dom
    await viewHtml(doc, type2unit1, binding);

    // 开始打印iframe内容
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
}

/**
 * mm/px 互转     mm：毫米   px：像素
 * @param option
 * @returns {*&{width: number, height: number}}
 * width、height：单位px
 * printWidth、printHeight：单位mm
 */
function type2unit(option) {
    let width = 0;
    let height = 0;
    let printWidth = 0;
    let printHeight = 0;
    if (option.type === 'px') {
        width = option.printWidth
        height = option.printHeight
        printWidth = Math.floor(new UnitConversion().pxConversionMm(option.printWidth))
        printHeight = Math.floor(new UnitConversion().pxConversionMm(option.printHeight))
    } else {
        width = Math.floor(new UnitConversion().mmConversionPx(option.printWidth))
        height = Math.floor(new UnitConversion().mmConversionPx(option.printHeight))
        printWidth = option.printWidth
        printHeight = option.printHeight
    }
    return {
        width,
        height,
        printWidth,
        printHeight
    }
}

// HTML转Canvas
async function viewHtml(doc, type2unit1, binding) {

    const targetDom = document.getElementById(binding.value);

    let tableCanvas = '';
    try {
        tableCanvas = await html2canvas(targetDom, {
            scale: 6
        });
    } catch (error) {
        console.log(error, 'errror');
    }

    tableCanvas.style.width = type2unit1.width + 'px';
    // mm 打印 height有1px误差
    tableCanvas.style.height = (type2unit1.height - 1) + 'px';

    doc.body.style.margin = 0;
    doc.body.style.padding = 0;

    doc.body.appendChild(tableCanvas);
}

// mm/px互转计算
function UnitConversion() {
    /**
     * 获取DPI
     * @returns {Array}
     */
    this.conversion_getDPI = function () {
        const arrDPI = [];
        if (window.screen.deviceXDPI) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        } else {
            const tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
    };
    /**
     * px转换为mm
     * @param value
     * @returns {number}
     */
    this.pxConversionMm = function (value) {
        value = parseInt(value);
        const inch = value / this.conversion_getDPI()[0];
        return inch * 25.4;
    };
    /**
     * mm转换为px
     * @param value
     * @returns {number}
     */
    this.mmConversionPx = function (value) {
        value = parseInt(value);
        const inch = value / 25.4;
        return inch * this.conversion_getDPI()[0];
    }
}

if (typeof window !== 'undefined' && Vue) {
    install(Vue);
}

export default {
    install,
};
