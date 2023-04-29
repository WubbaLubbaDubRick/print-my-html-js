import html2canvas from "html2canvas";
import { ViewHtml } from '../interface';

/**
 * HTML转Canvas，并添加到iframe的doc里
 * @param {ViewHtml} ViewHtml
 */
export async function viewHtml(ViewHtml: ViewHtml) {
    const nullDom: HTMLElement = document.createElement('div');
    nullDom.innerText = '无数据';
    const targetDom: HTMLElement = document.getElementById(ViewHtml.binding.value) || nullDom;

    let tableCanvas: HTMLCanvasElement = document.createElement('canvas');
    try {
        tableCanvas = await html2canvas(targetDom, {
            scale: ViewHtml.printScale
        });
    } catch (error) {
        console.error(error, 'error');
    }

    if (ViewHtml.type === 'custom') {
        tableCanvas.style.width = ViewHtml.type2unit1.width + 'px';
        // mm 打印 height有1px误差
        tableCanvas.style.height = (ViewHtml.type2unit1.height - 1) + 'px';
    }

    ViewHtml.doc.body.style.margin = '0';
    ViewHtml.doc.body.style.padding = '0';

    ViewHtml.doc.body.appendChild(tableCanvas);
}
