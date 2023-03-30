import { type NextPageWithLayout } from "~/pages/_app";
import { FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddArtworkFormSchema } from "~/utils/schema";
import { type z } from "zod";
import type FieldAttribute from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import Field from "~/components/form/Field";
import clsx from "clsx";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Head from "next/head";
import { useRouter } from "next/router";
import { type FtpUploadResult } from "~/pages/api/upload";
import { useRef } from "react";

const NewArtwork: NextPageWithLayout = () => {
    const router = useRouter();

    const artworkMutation = api.artwork.create.useMutation();
    const collections = api.collection.list.useQuery();
    const medium = api.medium.list.useQuery();

    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const artworkFields: FieldAttribute[] = [
        {
            name: "files",
            label: "Pick images/videos for the artwork",
            type: FieldType.FILE,
            inputFileRef,
            accept: "image/*,video/*",
            required: true,
            multiple: true
        },
        {
            name: "name",
            label: "Name of the Artwork",
            type: FieldType.TEXT
        },
        {
            name: "dimension",
            label: "Dimensions of the art",
            type: FieldType.TEXT,
        },
        {
            name: "shortDescription",
            label: "Short Description",
            type: FieldType.TEXT,
        },
        {
            name: "description",
            label: "Description",
            type: FieldType.RICHTEXT,
        },
        {
            name: "medium",
            label: "Medium",
            type: FieldType.MULTITAG,
            options: medium.data?.map(m => ({ value: m.id.toString(), label: m.name })) ?? []
        },
        {
            name: "featured",
            label: "Show this art on the home page?",
            type: FieldType.CHECKBOX,
        },
        {
            name: "availableForSale",
            label: "Is this art available for sale?",
            type: FieldType.CHECKBOX,
        },
        {
            name: "price",
            label: "The price for the art?",
            type: FieldType.NUMBER,
            defaultValue: 0
        },
        {
            name: "currency",
            label: "Currency",
            type: FieldType.SELECT,
            options: [
                { label: "ETB", value: "ETB" },
                { label: "USD", value: "USD" },
            ],
            defaultValue: "ETB"
        },
        {
            name: "orientation",
            label: "Orientation of the art",
            type: FieldType.SELECT,
            options: [
                { label: "Portrait", value: "Portrait" },
                { label: "Landscape", value: "Landscape" }
            ],
            defaultValue: "Portrait"
        },
        {
            name: "collectionId",
            label: "Collection",
            type: FieldType.SELECT,
            valueType: "number",
            options: [
                { label: "None", value: 0 },
                ...collections.data?.map(i => {
                    return { label: i.name, value: i.id }
                }) ?? []
            ],
            defaultValue: 0
        }
    ]

    type AddArtworkFormSchemaType = z.infer<typeof AddArtworkFormSchema>;
    const artworkForm = useForm<AddArtworkFormSchemaType>({
        resolver: zodResolver(AddArtworkFormSchema),
    });

    const onSubmit: SubmitHandler<AddArtworkFormSchemaType> = async (data) => {
        const toastId = toast.loading("Saving artwork...");

        try {
            if (!inputFileRef.current?.files?.length) {
                toast.error("Please, select the files you want to upload.", { id: toastId });
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

            const res = await artworkMutation.mutateAsync({
                ...data,
                files: result.urls.map(u => u.fileId),
                medium: artworkForm.getValues("medium")?.map(m => Number(m.value)) ?? []
            });

            artworkForm.reset(res);

            toast.success("Artwork added.", { id: toastId });

            await router.push("/admin/artworks");
        } catch {
            toast.error("Error saving artwork...", { id: toastId });
        }
    };

    return <>
        <Head>
            <title>Add a new Artwork - Hiluna Art</title>
        </Head>

        <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6">New artwork</h3>
                    <p className="mt-2 text-sm">Show your art to the world</p>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <FormProvider {...artworkForm}>
                        <form onSubmit={artworkForm.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-6 gap-6">
                                {artworkFields.map((field) => (
                                    <div className={clsx("col-span-6", !["shortDescription", "description", "files", "medium"].includes(field.name) && "sm:col-span-3")} key={field.name}>
                                        <Field {...field} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    disabled={artworkForm.formState.isSubmitting}
                                    className="btn btn-ghost"
                                    onClick={() => router.push("/admin/artworks")}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={artworkForm.formState.isSubmitting}
                                    className={clsx("ml-3 btn btn-primary", artworkForm.formState.isSubmitting && "loading")}>
                                    {artworkForm.formState.isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    </>
}

export default NewArtwork