import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { type InputFieldAttributes } from "./FieldAttributes";

const InputField: React.FC<InputFieldAttributes> = ({ label, name, type, defaultValue }) => {
    const form = useFormContext();

    useEffect(() => {
        form.setValue(name, defaultValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    return (
        <>
            <div className="form-control w-full">
                <label className="label" htmlFor={name}>
                    <span className="label-text">{label}</span>
                </label>
                <input className="input input-bordered w-full"
                    {...form.register(name)} id={name} type={type}
                    disabled={form.formState.isSubmitting}
                    defaultValue={defaultValue} />
                {form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
            </div>
        </>

    );
};

export default InputField;