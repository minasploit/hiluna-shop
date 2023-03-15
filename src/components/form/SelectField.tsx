import React, { useEffect } from "react";

import { useFormContext } from "react-hook-form";
import { type SelectFieldAttributes } from "./FieldAttributes";

const SelectField: React.FC<SelectFieldAttributes> = ({ label, name, options, defaultValue, valueType }) => {
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
				<select className="select select-bordered"
					{...form.register(name, { valueAsNumber: valueType == "number" })}
					id={name} defaultValue={defaultValue}
					disabled={form.formState.isSubmitting}>

					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{form.formState.errors[name] && <span className="text-red-500">{form.formState.errors[name]?.message?.toString()}</span>}
			</div>
		</>

	);
};

export default SelectField;