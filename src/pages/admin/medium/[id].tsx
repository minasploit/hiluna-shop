import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttributes from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { EditMediaFormSchema } from "~/utils/schema";

const EditMedium: NextPageWithLayout = () => {
    const router = useRouter()
    const { id } = router.query;

    const media = api.medium.getOne.useQuery(Number(id))

    const mediumMutation = api.medium.edit.useMutation();

    const mediumFields: FieldAttributes[] = [
        {
            id: "name",
            name: "name",
            label: "Name of the Media",
            type: FieldType.TEXT,
            defaultValue: media.data?.name
        },
        {
            id: "description",
            name: "description",
            label: "Description of the Media",
            type: FieldType.TEXT,
            defaultValue: media.data?.description ?? ""
        },
    ]

    type EditMediumFormSchemaType = z.infer<typeof EditMediaFormSchema>;
    const mediumForm = useForm<EditMediumFormSchemaType>({
        resolver: zodResolver(EditMediaFormSchema),
    });

    useEffect(() => {
        mediumForm.setValue("id", Number(id))
    }, [id, mediumForm]);

    const onSubmit: SubmitHandler<EditMediumFormSchemaType> = async (data) => {
        const toastId = toast.loading("Editing media...");

        try {
            const res = await mediumMutation.mutateAsync(data);

            mediumForm.reset(res)

            toast.success("Media edited", { id: toastId });

            await router.push("/admin/medium")
        } catch {
            toast.error("Error editing media", { id: toastId });
        }
    };


    return <>
        <Head>
            <title>Edit {media.data?.name} - Hiluna Art</title>
        </Head>

        <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6">Edit media</h3>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <FormProvider {...mediumForm}>
                        <form onSubmit={mediumForm.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-6 gap-6">
                                {mediumFields.map((field) => (
                                    <div className="col-span-6 sm:col-span-3" key={field.id}>
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

export default EditMedium