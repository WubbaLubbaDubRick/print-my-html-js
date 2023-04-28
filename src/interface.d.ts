import {DirectiveBinding} from "vue/types/options";

interface Type2UnitOptions {
    printWidth: number;
    printHeight: number;
    dom: HTMLElement;
    type: string;
}

interface Type2unit1 {
    width: number,
    height: number,
    printWidth: number,
    printHeight: number,
}

interface ViewHtml {
    doc: any,
    type2unit1: Type2unit1,
    binding: DirectiveBinding
}
