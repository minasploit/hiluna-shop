import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttribute from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { AddCollectionFormSchema } from "~/utils/schema";

const collectionsFields: FieldAttribute[] = [
    {
        id: "name",
        name: "name",
        label: "Name of the Collection",
        type: FieldType.TEXT,
    },
    {
        id: "description",
        name: "description",
        label: "Description of the Collection",
        type: FieldType.TEXT,
    },
]

const NewCollection: NextPageWithLayout = () => {
    const router = useRouter();

    const collectionsMutation = api.collection.create.useMutation();

    type AddCollectionsFormSchemaType = z.infer<typeof AddCollectionFormSchema>;
    const collectionForm = useForm<AddCollectionsFormSchemaType>({
        resolver: zodResolver(AddCollectionFormSchema),
    });

    const onSubmit: SubmitHandler<AddCollectionsFormSchemaType> = async (data) => {
        const toastId = toast.loading("Saving collection...");

        try {
            const res = await collectionsMutation.mutateAsync(data);

            collectionForm.reset(res)

            toast.success("Collection saved", { id: toastId });

            await router.push("/admin/collections")
        } catch {
            toast.error("Error saving collection", { id: toastId });
        }
    };

    return <>
        <Head>
            <title>Add a new Collection - Hiluna Art</title>
        </Head>

        <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-collections leading-6">New collection</h3>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <FormProvider {...collectionForm}>
                        <form onSubmit={collectionForm.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-6 gap-6">
                                {collectionsFields.map((field) => (
                                    <div className="col-span-6 sm:col-span-3" key={field.id}>
                                        <Field {...field} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    disabled={collectionForm.formState.isSubmitting}
                                    className="btn btn-ghost"
                                    onClick={() => router.push("/admin/collections")}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={collectionForm.formState.isSubmitting}
                                    className={clsx("ml-3 btn btn-primary", collectionForm.formState.isSubmitting && "loading")}>
                                    {collectionForm.formState.isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>

                    </FormProvider>
                </div>
            </div>
        </div>
    </>
}

export default NewCollection