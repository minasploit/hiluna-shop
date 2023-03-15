import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import type FieldAttribute from "./FieldAttributes";
import { FieldType } from "./FieldAttributes";
import NumberField from "./NumberField";
import RichInputField from "./RichInputField";
import FileField from "./FileField";

const Field: React.FC<FieldAttribute> = (props) => {
    switch (props.type) {
        case FieldType.TEXT:
            return <InputField {...props} />;
        case FieldType.SELECT:
            return <SelectField {...props} />;
        case FieldType.CHECKBOX:
            return <CheckboxField {...props} />;
        case FieldType.NUMBER:
            return <NumberField {...props} />;
        case FieldType.RICHTEXT:
            return <RichInputField {...props} />;
        case FieldType.FILE:
            return <FileField {...props} />;
        default:
            throw new Error("Invalid Field Type");
    }
};

export default Field;