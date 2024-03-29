import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { type NumberFieldAttributes } from "./FieldAttributes";

const NumberField: React.FC<NumberFieldAttributes> = ({ label, name, type, defaultValue, step }) => {
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
            <div className="form-control w-full">
                <label className="label" htmlFor={name}>
                    <span className="label-text">{label}</span>
                </label>
                <input className="input input-bordered w-full"
                    {...form.register(name, { valueAsNumber: true })}
                    id={name} type={type} defaultValue={defaultValue}
                    disabled={form.formState.isSubmitting} step={step} />
                {form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
            </div>
        </>

    );
};

export default NumberField;