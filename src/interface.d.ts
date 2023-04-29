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
    attributeResult: getAttributeType;
}

export interface getAttributeType {
    type?: string;
    justifyContent?: string;
    alignItems?: string;
    width?: number;
    height?: number;
    isPaved?: string;
    printWidth?: number;
    printHeight?: number;
    printBackground?: string;
    printScale?: string;
    error?: string;
}
