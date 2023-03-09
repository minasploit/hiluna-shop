enum FieldType {
    TEXT = "text",
    SELECT = "select",
    CHECKBOX = "checkbox",
    NUMBER = "number",
    RICHTEXT = "richtext",
}

interface BaseFieldAttributes {
    id: string;
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

type FieldAttributes = InputFieldAttributes | SelectFieldAttributes | CheckboxFieldAttributes | NumberFieldAttributes | RichInputFieldAttributes;

export default FieldAttributes;
export { FieldType, type InputFieldAttributes, type SelectFieldAttributes, type CheckboxFieldAttributes, type NumberFieldAttributes, type RichInputFieldAttributes };