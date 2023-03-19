import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttribute from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { EditArtworkFormSchema } from "~/utils/schema";
import Image from "next/image";
import { resolveResource } from "~/components/Functions";
import { type FtpUploadResult } from "~/pages/api/upload";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import Link from "next/link";

const EditArtwork: NextPageWithLayout = () => {
    const router = useRouter()
    const { id } = router.query;

    const artwork = api.artwork.getOne.useQuery(Number(id))

    const artworkMutation = api.artwork.edit.useMutation();
    const collections = api.collection.list.useQuery();

    const [imageFile, setImageFile] = useState<File>()

    const artworkFields: FieldAttribute[] = [
        {
            name: "name",
            label: "Name of the Artwork",
            type: FieldType.TEXT,
            defaultValue: artwork.data?.name,
        },
        {
            name: "dimension",
            label: "Dimensions of the art",
            type: FieldType.TEXT,
            defaultValue: artwork.data?.dimension,
        },
        {
            name: "description",
            label: "Description",
            type: FieldType.RICHTEXT,
            defaultValue: artwork.data?.description,
        },
        {
            name: "featured",
            label: "Show this art on the home page?",
            type: FieldType.CHECKBOX,
            defaultValue: artwork.data?.featured,
        },
        {
            name: "availableForSale",
            label: "Is this art available for sale?",
            type: FieldType.CHECKBOX,
            defaultValue: artwork.data?.availableForSale,
        },
        {
            name: "price",
            label: "The price for the art?",
            type: FieldType.NUMBER,
            defaultValue: artwork.data?.price,
        },
        {
            name: "currency",
            label: "Currency",
            type: FieldType.SELECT,
            options: [
                { label: "ETB", value: "ETB" },
                { label: "USD", value: "USD" },
            ],
            defaultValue: artwork.data?.currency,
        },
        {
            name: "orientation",
            label: "Orientation of the art",
            type: FieldType.SELECT,
            options: [
                { label: "Portrait", value: "Portrait" },
                { label: "Landscape", value: "Landscape" }
            ],
            defaultValue: artwork.data?.orientation ?? "Portrait",
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
            defaultValue: artwork.data?.collectionId ?? 0,
        },
    ]

    type EditArtworksFormSchemaType = z.infer<typeof EditArtworkFormSchema>;
    const artworkForm = useForm<EditArtworksFormSchemaType>({
        resolver: zodResolver(EditArtworkFormSchema),
    });

    useEffect(() => {
        artworkForm.setValue("id", Number(id))
        artworkForm.setValue("imageUrl", artwork.data?.imageUrl)
    }, [id, artworkForm, artwork.data?.imageUrl]);

    const handleSelectedFile = (files: FileList | null) => {
        if (files && files[0] && files[0].size < 10000000) {
            setImageFile(files[0])
        } else {
            toast.error("file size too large");
        }
    }

    const onSubmit: SubmitHandler<EditArtworksFormSchemaType> = async (data) => {
        const toastId = toast.loading("Editing artwork...");

        try {
            let url = artwork.data?.imageUrl ?? ""

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json() as FtpUploadResult;

                if (result.status == 500 || !result.urls[0]) {
                    toast.error("Error uploading the file", { id: toastId });
                    return;
                }

                url = result.urls[0]?.newName;
            }

            const res = await artworkMutation.mutateAsync({
                ...data,
                imageUrl: url
            });

            artworkForm.reset(res);

            toast.success("Artwork edited.", { id: toastId });

            await router.push("/admin/artworks")
        } catch {
            toast.error("Error editing artwork", { id: toastId });
        }
    };


    return <>
        <Head>
            <title>Edit {artwork.data?.name} - Hiluna Art</title>
        </Head>

        {
            (artwork.isLoading || !artwork.data) &&
            <div className="flex items-center justify-center mt-12">
                {
                    artwork.isLoading &&
                    <LoadingSpinner />
                }

                {
                    (!artwork.data && !artwork.isLoading) &&
                    <div className="card w-96 bg-base-100 shadow-xl border border-red-400">
                        <div className="card-body">
                            <h2 className="card-title">Error</h2>
                            <p>The artwork selected doesn&apos;t exist.</p>
                            <div className="card-actions justify-end mt-2">
                                <Link href={`/admin/artworks`}>
                                    <button className="btn btn-primary btn-sm">Go back</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }

        {
            artwork.data &&
            <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-collections leading-6">Edit artwork</h3>
                        <label className="label mt-2">
                            <span className="label-text">Current artwork image</span>
                        </label>
                        <div className="flex justify-center">
                            {
                                artwork.data.imageUrl &&
                                <Image
                                    src={resolveResource(artwork.data.imageUrl)}
                                    width={320} height={320} alt="Artwork image"
                                    priority
                                />
                            }
                        </div>
                    </div>

                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <FormProvider {...artworkForm}>
                            <form onSubmit={artworkForm.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="form-control w-full col-span-6">
                                        <label className="label">
                                            <span className="label-text">Pick an image for the artwork</span>
                                        </label>
                                        <input type="file" accept="image/*" className="file-input file-input-bordered file-input-primary w-full"
                                            name="imageUrl" onChange={(files) => handleSelectedFile(files.target.files)}
                                            disabled={artworkForm.formState.isSubmitting} />
                                    </div>

                                    {artworkFields.map((field) => (
                                        <div className={clsx("col-span-6", field.name != "description" && "sm:col-span-3")} key={field.name}>
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
        }
    </>
}

export default EditArtwork