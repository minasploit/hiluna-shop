import React from "react";
import { useForm, FormProvider, type SubmitHandler, type FieldValues } from "react-hook-form";
import Field from "~/components/form/Field";
import type FieldAttributes from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import crypto from 'crypto';
import { type NextPageWithLayout } from "./_app";

const formSchema: FieldAttributes[] = [
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "fullName",
        label: "Full Name",
        type: FieldType.TEXT,
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "favAnimal",
        label: "What is Your Favourite Pet?",
        type: FieldType.SELECT,
        options: [
            { label: "Dog 🐶", value: "dog" },
            { label: "Cat 😺", value: "cat" },
            { label: "Bird 🐦", value: "bird" },
            { label: "Fish 🐟", value: "fish" },
            { label: "Tasmanian Devil 😈", value: "devil" },
        ],
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "agreeToTerms",
        label: "I Agree to all Terms and Conditions",
        type: FieldType.CHECKBOX,
    },
];

const Form: NextPageWithLayout = () => {
    const form = useForm();

    const onSubmitHandler: SubmitHandler<FieldValues> = (values: unknown) => {
        console.log(`Submitted`);
        console.log(values);
    };

    return (
        <main className="main">
            {/* setup form provider, so that we can use useFormContext in the input field component */}
            <FormProvider {...form}>
                <form className="form" onSubmit={form.handleSubmit(onSubmitHandler)}>
                    {formSchema.map((field) => (
                        <Field key={field.id} {...field} />
                    ))}
                    <button type="submit">Submit</button>
                </form>

                {/* display the values of the form on the page */}
                <section>
                    <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
                </section>
            </FormProvider>
        </main>
    );
}

export default Form