import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { type CheckboxFieldAttributes } from "./FieldAttributes";

const CheckboxField: React.FC<CheckboxFieldAttributes> = ({ label, name, type, defaultValue }) => {
    const form = useFormContext();

    useEffect(() => {
        if (!form.formState.isDirty)
            form.setValue(name, defaultValue, {
                shouldDirty: false
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    return (
        <>
            <div className="form-control">
                <label className="label cursor-pointer" htmlFor={name}>
                    <span className="label-text">{label}</span>
                    <input className="checkbox checkbox-primary"
                        {...form.register(name)}
                        type={type} id={name}
                        defaultChecked={defaultValue}
                        disabled={form.formState.isSubmitting} />
                </label>
                {form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
            </div>
        </>

    );
};

export default CheckboxField;