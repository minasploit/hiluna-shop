import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import 'react-quill/dist/quill.snow.css'
import { Controller, useFormContext } from "react-hook-form";
import { type RichTextFieldAttributes } from "./FieldAttributes";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RichTextField: React.FC<RichTextFieldAttributes> = ({ label, name, defaultValue }) => {
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

                <Controller
                    name="description"
                    control={form.control}
                    defaultValue={defaultValue}
                    rules={{
                        required: "Please enter task description",
                    }}
                    render={({ field }) => (
                        <ReactQuill
                            readOnly={form.formState.isSubmitting}
                            theme="snow"
                            {...field}
                            placeholder={"Write Description"}
                            onChange={(text) => {
                                field.onChange(text);
                            }}
                        />
                    )} />
                {form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
            </div>
        </>

    );
};

export default RichTextField;