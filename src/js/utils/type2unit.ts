import {Type2unit1} from '../../interface';

/**
 * mm/px 互转
 * mm：毫米
 * px：像素
 * @param option
 * @returns {*&{width: number, height: number}}
 * width、height：单位px
 * printWidth、printHeight：单位mm
 */
export function type2unit(option: { dom: HTMLElement; type: string }) {
    // 打印宽度
    let printWidth: number = parseInt(option.dom.getAttribute('printWidth') || '210');
    // 打印高度
    let printHeight: number = parseInt(option.dom.getAttribute('printHeight') || '297');

    const Type2unit1: Type2unit1 = {
        width: 0,
        height: 0,
        printWidth: 0,
        printHeight: 0,
    }

    Type2unit1.width = option.dom.offsetWidth
    Type2unit1.height = option.dom.offsetHeight

    if (option.type === 'custom') {
        Type2unit1.printWidth = printWidth
        Type2unit1.printHeight = printHeight
    } else {
        Type2unit1.printWidth = 210
        Type2unit1.printHeight = 297
    }

    return Type2unit1
}
