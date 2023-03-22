import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { type SelectValue } from "react-tailwindcss-select/dist/components/type";
import { type MultiTagFieldAttributes } from "./FieldAttributes";

const MultiTagField: React.FC<MultiTagFieldAttributes> = ({ label, name, options }) => {

    const form = useFormContext();
    const [value, setValue] = useState<SelectValue>([]);

    useEffect(() => {
        // form.register(name);
    }, [form, name]);

    useEffect(() => {
        if (!form.formState.isDirty)
            form.setValue(name, [], {
                shouldDirty: false
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    function handleChange(value: SelectValue) {
        setValue(value);

        form.setValue(name, value);
    }

    return (
        <>
            <div className="form-control w-full">
                <label className="label" htmlFor={name}>
                    <span className="label-text">{label}</span>
                </label>
                <Select
                    value={value}
                    onChange={handleChange}
                    options={options}
                    isMultiple={true}
                    isSearchable={true}
                    placeholder="Select medium..."
                    primaryColor=""
                    isDisabled={form.formState.isSubmitting}
                    classNames={{
                        tagItem: () => "flex px-3 py-1 bg-primary/80 rounded-md",
                        tagItemText: "text-white mr-2",
                        tagItemIcon: "w-3 h-3 mt-0.5 text-white",
                        menuButton: () => "flex p-1.5 text-md text-gray-500 border border-gray-500 rounded-lg shadow-sm transition-all duration-300 cursor-pointer focus:outline-none focus:border-primary focus:ring focus:ring-primary/20",
                        menu: "absolute z-10 w-full bg-base-100 shadow-lg border border-gray-500 rounded py-1 mt-1.5 text-md text-gray-700",
                        listItem: () => "list-none py-2 px-2 hover:bg-primary hover:text-white rounded-md cursor-pointer text-base-content"
                    }}
                />
                {form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
            </div>
        </>

    );
};

export default MultiTagField;