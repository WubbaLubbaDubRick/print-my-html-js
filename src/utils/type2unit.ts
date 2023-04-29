import { Type2unit1 } from '../interface';

/**
 * mm/px 互转     mm：毫米   px：像素
 * @param option
 * @returns {*&{width: number, height: number}}
 * width、height：单位px
 * printWidth、printHeight：单位mm
 */
export function type2unit(option: { dom: HTMLElement; type: string | undefined }) {
    // 打印宽度
    let printWidth: number = parseInt(option.dom.getAttribute('printWidth') || '0');
    // 打印高度
    let printHeight: number =  parseInt(option.dom.getAttribute('printHeight') || '0');

    // 默认打印宽度
    if (printWidth === 0) {
        printWidth = option.dom.offsetWidth;
    }
    // 默认打印高度
    if (printHeight === 0) {
        printHeight = option.dom.offsetHeight;
    }

    const Type2unit1: Type2unit1 = {
        width: 0,
        height: 0,
        printWidth: 0,
        printHeight: 0,
    }

    Type2unit1.width = Math.floor(new UnitConversion().mmConversionPx(printWidth))
    Type2unit1.height = Math.floor(new UnitConversion().mmConversionPx(printHeight))
    if (option.type === 'custom') {
        Type2unit1.printWidth = printWidth
        Type2unit1.printHeight = printHeight
    } else {
        Type2unit1.printWidth = 210
        Type2unit1.printHeight = 297
    }
    return Type2unit1
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
