import React from "react";
import { useFormContext } from "react-hook-form";
import { type HiddenFieldAttributes } from "./FieldAttributes";

const HiddenField: React.FC<HiddenFieldAttributes> = ({ name, type, valueType, defaultValue }) => {
    const form = useFormContext();

    return (
        <>
            <div>
                <input
                    {...form.register(name, { valueAsNumber: valueType == "number" })} id={name} type={type}
                    disabled={form.formState.isSubmitting}
                    defaultValue={defaultValue} />
                {form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
            </div>
        </>

    );
};

export default HiddenField;