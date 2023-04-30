import {getAttributeType, Type2unit1} from '../interface';
import {type2unit} from "./utils/type2unit";

/**
 * 获取 id 对应的 dom 上的属性
 * @param dom
 */
export function getAttribute(dom: HTMLElement): getAttributeType {
    // 定义打印接收类型范围
    const typeList: string[] = ['custom', 'default'];
    // 对齐属性范围
    let alignList: string[] = ['start', 'center', 'end'];
    // 铺满属性范围
    let pavedList: string[] = ['paved', 'halfPaved', 'default'];

    // 打印类型
    const type: string = dom.getAttribute('type') || 'default';
    // console.log(typeList.indexOf(type))
    if (typeList.indexOf(type) < 0) {
        // console.error(new TypeError("type：未定义的打印类型"));
        return { error: "type：未定义的打印类型" };
    }

    // 文本水平对齐
    let justifyContent: string = dom.getAttribute('justifyContent') || 'start';
    if (alignList.indexOf(justifyContent) > -1) {
        if (justifyContent !== 'center') {
            justifyContent = 'flex-' + justifyContent;
        }
    } else {
        return { error: "justifyContent：未定义的对齐方式" };
    }

    // 打印背景颜色
    let printBackground: string = dom.getAttribute('printBackground') || '#fff';

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
    let printScale: string = dom.getAttribute('printScale') || '1';
    if (isNaN(parseInt(printScale)) || parseInt(printScale) <= 0) {
        return { error: "printScale：未定义的printScale数值（大于0且只能是数字）" };
    }

    // 铺满类型
    let isPaved: string = dom.getAttribute('isPaved') || 'default';
    if (pavedList.indexOf(isPaved) === -1) {
        return { error: "isPaved：未定义的isPaved类型" };
    }

    let type2unit1: Type2unit1 = type2unit({ dom, type });

    return {
        type,
        justifyContent,
        alignItems,
        isPaved,
        printBackground,
        ...type2unit1,
        printScale,
    }
}
