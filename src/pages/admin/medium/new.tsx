import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttribute from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import { type NextPageWithLayout } from "~/pages/_app";
import { type FtpUploadResult } from "~/pages/api/upload";
import { api } from "~/utils/api";
import { AddMediaFormSchema } from "~/utils/schema";

const NewMedium: NextPageWithLayout = () => {
    const router = useRouter();

    const mediumMutation = api.medium.create.useMutation();

    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const mediumFields: FieldAttribute[] = [
        {
            name: "name",
            label: "Name of the Media",
            type: FieldType.TEXT,
        },
        {
            name: "description",
            label: "Description of the Media",
            type: FieldType.TEXT,
        },
        {
            name: "featureImageId",
            label: "Feature Image",
            type: FieldType.FILE,
            accept: "image/*",
            inputFileRef,
        },
        {
            name: "featured",
            label: "Featured on the home page?",
            type: FieldType.CHECKBOX
        },
        {
            name: "featureOrder",
            label: "Order in which the media is shown in the Home Page",
            type: FieldType.NUMBER,
            defaultValue: 0
        }
    ]

    type AddMediumFormSchemaType = z.infer<typeof AddMediaFormSchema>;
    const mediumForm = useForm<AddMediumFormSchemaType>({
        resolver: zodResolver(AddMediaFormSchema),
    });

    const onSubmit: SubmitHandler<AddMediumFormSchemaType> = async (data) => {
        const toastId = toast.loading("Saving media...");

        try {
            let fileId: number | undefined;

            if (mediumForm.getValues("featured")) {
                if (!inputFileRef.current?.files?.length) {
                    toast.error("Please, select the file you want to use as a feature image", { id: toastId });
                    return;
                }

                const formData = new FormData();
                Object.values(inputFileRef.current.files).forEach(file => {
                    formData.append('file', file);
                })

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json() as FtpUploadResult;

                if (result.status == 500 || !result.urls[0]) {
                    toast.error("Error uploading the file", { id: toastId });
                    return;
                }

                fileId = result.urls[0].fileId
            }

            const res = await mediumMutation.mutateAsync({
                ...data,
                featureImageId: fileId
            });

            mediumForm.reset(res)

            toast.success("Media saved", { id: toastId });

            await router.push("/admin/medium")
        } catch {
            toast.error("Error saving media", { id: toastId });
        }
    };

    return <>
        <Head>
            <title>Add a new Media - Hiluna Art</title>
        </Head>

        <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6">New media</h3>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <FormProvider {...mediumForm}>
                        <form onSubmit={mediumForm.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-6 gap-6">
                                {mediumFields.map((field) => (
                                    <div className={clsx("col-span-6", !["featureImageId"].includes(field.name) && "sm:col-span-3")} key={field.name}>
                                        <Field {...field} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    disabled={mediumForm.formState.isSubmitting}
                                    className="btn btn-ghost"
                                    onClick={() => router.push("/admin/medium")}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={mediumForm.formState.isSubmitting}
                                    className={clsx("ml-3 btn btn-primary", mediumForm.formState.isSubmitting && "loading")}>
                                    {mediumForm.formState.isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>

                    </FormProvider>
                </div>
            </div>
        </div>
    </>
}

export default NewMedium