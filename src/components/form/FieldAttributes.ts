import type React from "react";
import { type SelectValue, type Options } from "react-tailwindcss-select/dist/components/type";

enum FieldType {
    TEXT = "text",
    SELECT = "select",
    CHECKBOX = "checkbox",
    NUMBER = "number",
    RICHTEXT = "richtext",
    FILE = "file",
    MULTITAG = "multitag",
}

interface BaseFieldAttributes {
    // id: string;
    label: string;
    name: string;
    type: FieldType;
}

interface SelectStringOptions {
    label: string;
    value: string
}

interface SelectNumberOptions {
    label: string;
    value: number
}

interface SelectFieldAttributes extends BaseFieldAttributes {
    type: FieldType.SELECT;
    options: SelectStringOptions[] | SelectNumberOptions[];
    valueType?: "string" | "number";
    defaultValue?: string | number;
}

interface CheckboxFieldAttributes extends BaseFieldAttributes {
    type: FieldType.CHECKBOX;
    defaultValue?: boolean;
}

interface NumberFieldAttributes extends BaseFieldAttributes {
    type: FieldType.NUMBER;
    defaultValue?: number;
}

interface RichInputFieldAttributes extends BaseFieldAttributes {
    type: FieldType.RICHTEXT;
    defaultValue?: string;
}

interface InputFieldAttributes extends BaseFieldAttributes {
    type: FieldType.TEXT;
    defaultValue?: string;
}

interface FileFieldAttributes extends BaseFieldAttributes {
    type: FieldType.FILE;
    inputFileRef?: React.MutableRefObject<HTMLInputElement | null>,
    accept?: string,
    multiple?: boolean,
    required?: boolean
}

interface MultiTagFieldAttributes extends BaseFieldAttributes {
    type: FieldType.MULTITAG;
    options: Options;
    defaultValue?: SelectValue;
}

type FieldAttribute = InputFieldAttributes | SelectFieldAttributes | CheckboxFieldAttributes | NumberFieldAttributes | RichInputFieldAttributes | FileFieldAttributes | MultiTagFieldAttributes;

export default FieldAttribute;
export { FieldType, type InputFieldAttributes, type SelectFieldAttributes, type CheckboxFieldAttributes, type NumberFieldAttributes, type RichInputFieldAttributes, type FileFieldAttributes, type MultiTagFieldAttributes };