import { getAttributeResult } from '../interface';

/**
 * 获取 id 对应的 dom 上的属性
 * @param dom
 */
export function getAttribute(dom: HTMLElement): getAttributeResult {
    /*
     * 定义打印接收类型范围
     */
    const typeList: string[] = ['custom', 'default'];

    // 打印类型
    const type: string = dom.getAttribute('type') || 'default';
    // console.log(typeList.indexOf(type))
    if (typeList.indexOf(type) < 0) {
        // console.error(new TypeError("type：未定义的打印类型"));
        return { error: "type：未定义的打印类型" };
    }

    // 对齐属性范围
    let alignList: string[] = ['start', 'center', 'end'];

    // 文本水平对齐
    let justifyContent: string = dom.getAttribute('justifyContent') || 'start';
    if (alignList.indexOf(justifyContent) > -1) {
        if (justifyContent !== 'center') {
            justifyContent = 'flex-' + justifyContent;
        }
    } else {
        return { error: "justifyContent：未定义的对齐方式" };
    }

    // 文本纵向对齐
    let alignItems: string = dom.getAttribute('alignItems') || 'start';
    if (alignList.indexOf(alignItems) > -1) {
        if (alignItems !== 'center') {
            alignItems = 'flex-' + alignItems;
        }
    } else {
        return { error: "alignItems：未定义的对齐方式" };
    }

    // 打印清晰度
    let printScale: number = parseInt(dom.getAttribute('printScale') || '1');
    if (isNaN(printScale) || printScale <= 0) {
        return { error: "printScale：未定义的printScale数值" };
    }

    return {
        type,
        justifyContent,
        alignItems,
        printScale,
        error: undefined
    }
}
