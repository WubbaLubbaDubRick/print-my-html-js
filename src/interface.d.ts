import {DirectiveBinding} from "vue/types/options";

export interface Type2UnitOptions {
    dom: HTMLElement;
    type: string;
}

export interface Type2unit1 {
    width: number,
    height: number,
    printWidth: number,
    printHeight: number,
}

export interface ViewHtml {
    doc: Document;
    binding: DirectiveBinding;
    type2unit1: Type2unit1;
    type: string | undefined
    printScale?: number | undefined;
}

export interface getAttributeType {
    type: string;
    justifyContent?: string;
    alignItems?: string;
    printScale?: number;
    error?: string;
}

export type getAttributeResult = getAttributeType | { error: string };
