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
    const scale: number = parseInt(ViewHtml.attributeResult.printScale || '1');
    try {
        tableCanvas = await html2canvas(targetDom, {
            scale: scale
        });
    } catch (error) {
        console.error(error, 'error');
    }

    if (ViewHtml.attributeResult.type === 'custom') {
        if (ViewHtml.attributeResult.isPaved === 'paved') {
            tableCanvas.style.width = '100%';
            tableCanvas.style.height = '100%';
        } else if (ViewHtml.attributeResult.isPaved === 'halfPaved') {
            tableCanvas.style.width = '100%';
            tableCanvas.style.height = '50%';
        } else {
            tableCanvas.style.width = ViewHtml.attributeResult.width + 'px';
            // mm 打印 height有1px误差
            tableCanvas.style.height = ViewHtml.attributeResult.height + 'px';
        }
    } else {
        if (ViewHtml.attributeResult.isPaved === 'paved') {
            tableCanvas.style.width = '100%';
            tableCanvas.style.height = '100%';
        } else if (ViewHtml.attributeResult.isPaved === 'halfPaved') {
            tableCanvas.style.width = '100%';
            tableCanvas.style.height = '50%';
        }
    }

    ViewHtml.doc.body.appendChild(tableCanvas);
}
