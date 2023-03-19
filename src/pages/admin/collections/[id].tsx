import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttribute from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { EditCollectionFormSchema } from "~/utils/schema";

const EditCollection: NextPageWithLayout = () => {
    const router = useRouter()
    const { id } = router.query;

    const collection = api.collection.getOne.useQuery(Number(id))

    const collectionsMutation = api.collection.edit.useMutation();

    const collectionsFields: FieldAttribute[] = [
        {
            name: "name",
            label: "Name of the Collection",
            type: FieldType.TEXT,
            defaultValue: collection.data?.name
        },
        {
            name: "description",
            label: "Description of the Collection",
            type: FieldType.TEXT,
            defaultValue: collection.data?.description ?? ""
        },
    ]

    type EditCollectionsFormSchemaType = z.infer<typeof EditCollectionFormSchema>;
    const collectionsForm = useForm<EditCollectionsFormSchemaType>({
        resolver: zodResolver(EditCollectionFormSchema),
    });

    useEffect(() => {
        collectionsForm.setValue("id", Number(id))
    }, [id, collectionsForm]);

    const onSubmit: SubmitHandler<EditCollectionsFormSchemaType> = async (data) => {
        const toastId = toast.loading("Editing collection...");

        try {
            const res = await collectionsMutation.mutateAsync(data);

            collectionsForm.reset(res)

            toast.success("Collection edited", { id: toastId });

            await router.push("/admin/collections")
        } catch {
            toast.error("Error editing collection", { id: toastId });
        }
    };


    return <>
        <Head>
            <title>Edit {collection.data?.name} - Hiluna Art</title>
        </Head>

        {
            (collection.isLoading || !collection.data) &&
            <div className="flex items-center justify-center mt-12">
                {
                    collection.isLoading &&
                    <LoadingSpinner />
                }

                {
                    (!collection.data && !collection.isLoading) &&
                    <div className="card w-96 bg-base-100 shadow-xl border border-red-400">
                        <div className="card-body">
                            <h2 className="card-title">Error</h2>
                            <p>The collection selected doesn&apos;t exist.</p>
                            <div className="card-actions justify-end mt-2">
                                <Link href={`/admin/collections`}>
                                    <button className="btn btn-primary btn-sm">Go back</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }

        {
            collection.data &&
            <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-collections leading-6">Edit collection</h3>
                    </div>

                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <FormProvider {...collectionsForm}>
                            <form onSubmit={collectionsForm.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-6 gap-6">
                                    {collectionsFields.map((field) => (
                                        <div className="col-span-6 sm:col-span-3" key={field.name}>
                                            <Field {...field} />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        disabled={collectionsForm.formState.isSubmitting}
                                        className="btn btn-ghost"
                                        onClick={() => router.push("/admin/collections")}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={collectionsForm.formState.isSubmitting}
                                        className={clsx("ml-3 btn btn-primary", collectionsForm.formState.isSubmitting && "loading")}>
                                        {collectionsForm.formState.isSubmitting ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>

                        </FormProvider>
                    </div>
                </div>
            </div>
        }
    </>
}

export default EditCollection