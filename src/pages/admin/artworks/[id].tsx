import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef } from "react";
import { FormProvider, useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttribute from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { EditArtworkFormSchema } from "~/utils/schema";
import Image from "next/image";
import { resolveUploadResource } from "~/utils/functions";
import { type FtpUploadResult } from "~/pages/api/upload";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import Link from "next/link";
import { FileType } from "@prisma/client";

const EditArtwork: NextPageWithLayout = () => {
    const router = useRouter()
    const { id } = router.query;

    const artwork = api.artwork.getOne.useQuery(Number(id), { enabled: id != null })

    const artworkMutation = api.artwork.edit.useMutation();
    const collections = api.collection.list.useQuery();
    const medium = api.medium.list.useQuery();

    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const artworkFields: FieldAttribute[] = [
        {
            name: "files",
            label: "Pick new images/videos for the artwork",
            type: FieldType.FILE,
            inputFileRef,
            accept: "image/*,video/*",
            multiple: true,
            required: false
        },
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
            name: "shortDescription",
            label: "Short Description",
            type: FieldType.TEXT,
            defaultValue: artwork.data?.shortDescription,
        },
        {
            name: "description",
            label: "Description",
            type: FieldType.RICHTEXT,
            defaultValue: artwork.data?.description,
        },
        {
            name: "medium",
            label: "Medium",
            type: FieldType.MULTITAG,
            options: medium.data?.map(m => ({ value: m.id.toString(), label: m.name })) ?? [],
            defaultValue: artwork.data?.Medium.map(m => (
                {
                    "value": m.id.toString(),
                    "label": m.name,
                    "disabled": false
                }
            ))
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
        {
            name: "rating",
            label: "Rating of the Artwork (out of 5)",
            type: FieldType.NUMBER,
            step: "0.5",
            defaultValue: artwork.data?.rating
        },
    ]

    type EditArtworksFormSchemaType = z.infer<typeof EditArtworkFormSchema>;
    const artworkForm = useForm<EditArtworksFormSchemaType>({
        resolver: zodResolver(EditArtworkFormSchema),
        defaultValues: {
            fileOrder: []
        }
    });

    useFieldArray({
        control: artworkForm.control,
        name: "fileOrder"
    });

    useEffect(() => {
        artworkForm.setValue("id", Number(id))
        artworkForm.setValue("files", artwork.data?.Files?.map(f => f.File.id))
    }, [id, artworkForm, artwork.data?.Files]);

    const onSubmit: SubmitHandler<EditArtworksFormSchemaType> = async (data) => {
        const toastId = toast.loading("Editing artwork...");

        try {
            if (!artwork.data) {
                toast.error("Wait for the artwork to load", { id: toastId });
                return;
            }

            let urls = artwork.data.Files.map(f => f.File.id);

            if (inputFileRef.current?.files?.length) {
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

                urls = result.urls.map(u => u.fileId);
            }

            const fileOrder = artworkForm.getValues("fileOrder").map(f => ({
                fileId: f?.fileId,
                order: f?.order
            }))

            const res = await artworkMutation.mutateAsync({
                ...data,
                medium: artworkForm.getValues("medium")?.map(m => Number(m.value)) ?? [],
                fileOrder: fileOrder,
                files: urls
            });

            await artwork.refetch();

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
                <FormProvider {...artworkForm}>
                    <form onSubmit={artworkForm.handleSubmit(onSubmit)}>
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-collections leading-6">Edit artwork</h3>
                                <label className="label my-2">
                                    <span className="label-text">Current artwork files</span>
                                </label>
                                <div className="flex items-center flex-col">
                                    {
                                        artwork.data.Files.map(f => (
                                            <Fragment key={f.File.id}>
                                                <div className="border-2 border-primary rounded-xl">
                                                    {
                                                        f.File.fileType == FileType.Image &&
                                                        <Image
                                                            src={resolveUploadResource(f.File.fileUrl)}
                                                            width={320} height={320} alt="Artwork image"
                                                            className="w-auto rounded-t-xl"
                                                            priority
                                                        />
                                                    }
                                                    {
                                                        f.File.fileType == FileType.Video &&
                                                        <video controls className="rounded-t-xl">
                                                            <source src={resolveUploadResource(f.File.fileUrl)} type={f.File.mimeType ?? "video/mp4"} />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    }

                                                    <div className="p-3 pt-0">
                                                        <Field type={FieldType.NUMBER} label="Priority of the file" name={`fileOrder.${f.fileId}.order`} defaultValue={f.fileOrder} />
                                                        <Field type={FieldType.HIDDEN} name={`fileOrder.${f.fileId}.fileId`} valueType="number" defaultValue={f.fileId} />
                                                    </div>
                                                </div>

                                                <br />
                                            </Fragment>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="mt-5 md:mt-0 md:col-span-2 h-fit sticky top-[8.5rem]">
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

                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        }
    </>
}

export default EditArtwork