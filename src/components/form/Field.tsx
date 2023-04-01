import React from "react";
import TextField from "./TextField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import type FieldAttribute from "./FieldAttributes";
import { FieldType } from "./FieldAttributes";
import NumberField from "./NumberField";
import RichTextField from "./RichTextField";
import FileField from "./FileField";
import MultiTagField from "./MultiTagField";
import HiddenField from "./HiddenField";

const Field: React.FC<FieldAttribute> = (props) => {
    switch (props.type) {
        case FieldType.TEXT:
            return <TextField {...props} />;
        case FieldType.SELECT:
            return <SelectField {...props} />;
        case FieldType.CHECKBOX:
            return <CheckboxField {...props} />;
        case FieldType.NUMBER:
            return <NumberField {...props} />;
        case FieldType.RICHTEXT:
            return <RichTextField {...props} />;
        case FieldType.FILE:
            return <FileField {...props} />;
        case FieldType.MULTITAG:
            return <MultiTagField {...props} />;
        case FieldType.HIDDEN:
            return <HiddenField {...props} />;
        default:
            throw new Error("Invalid Field Type");
    }
};

export default Field;