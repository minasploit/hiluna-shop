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
    HIDDEN = "hidden",
}

interface BaseFieldAttributes {
    name: string;
    type: FieldType;
}

interface VisibleBaseFieldAttributes extends BaseFieldAttributes {
    label: string;
}

interface SelectStringOptions {
    label: string;
    value: string
}

interface SelectNumberOptions {
    label: string;
    value: number
}

interface SelectFieldAttributes extends VisibleBaseFieldAttributes {
    type: FieldType.SELECT;
    options: SelectStringOptions[] | SelectNumberOptions[];
    valueType?: "string" | "number";
    defaultValue?: string | number;
}

interface CheckboxFieldAttributes extends VisibleBaseFieldAttributes {
    type: FieldType.CHECKBOX;
    defaultValue?: boolean;
}

interface NumberFieldAttributes extends VisibleBaseFieldAttributes {
    type: FieldType.NUMBER;
    defaultValue?: number;
}

interface RichTextFieldAttributes extends VisibleBaseFieldAttributes {
    type: FieldType.RICHTEXT;
    defaultValue?: string;
}

interface TextFieldAttributes extends VisibleBaseFieldAttributes {
    type: FieldType.TEXT;
    defaultValue?: string;
}

interface FileFieldAttributes extends VisibleBaseFieldAttributes {
    type: FieldType.FILE;
    inputFileRef?: React.MutableRefObject<HTMLInputElement | null>,
    accept?: string,
    multiple?: boolean,
    required?: boolean
}

interface MultiTagFieldAttributes extends VisibleBaseFieldAttributes {
    type: FieldType.MULTITAG;
    options: Options;
    defaultValue?: SelectValue;
}

interface HiddenFieldAttributes extends BaseFieldAttributes {
    type: FieldType.HIDDEN;
    defaultValue: number | string,
    valueType?: "string" | "number";
}

type FieldAttribute = TextFieldAttributes | SelectFieldAttributes | CheckboxFieldAttributes | NumberFieldAttributes | RichTextFieldAttributes | FileFieldAttributes | MultiTagFieldAttributes | HiddenFieldAttributes;

export default FieldAttribute;
export { FieldType, type TextFieldAttributes, type SelectFieldAttributes, type CheckboxFieldAttributes, type NumberFieldAttributes, type RichTextFieldAttributes, type FileFieldAttributes, type MultiTagFieldAttributes, type HiddenFieldAttributes };