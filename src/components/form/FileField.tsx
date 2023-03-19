import React from "react";
import { useFormContext } from "react-hook-form";
import { type FileFieldAttributes } from "./FieldAttributes";

const FileField: React.FC<FileFieldAttributes> = ({ label, name, type, inputFileRef, accept, multiple, required }) => {
    const form = useFormContext();

    return (
        <>
            <div className="form-control w-full">
                <label className="label" htmlFor={name}>
                    <span className="label-text">{label}</span>
                </label>
                <input type={type} accept={accept} className="file-input file-input-bordered file-input-primary w-full"
                    {...form.register(name)} required={required}
                    ref={inputFileRef} multiple={multiple}
                    disabled={form.formState.isSubmitting} />
                {form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
            </div>
        </>
    );
};

export default FileField;