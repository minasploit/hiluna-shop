import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttributes from "~/components/form/FieldAttributes";
import crypto from 'crypto';
import { FieldType } from "~/components/form/FieldAttributes";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { EditArtworkFormSchema } from "~/utils/schema";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "firebaseConfig";
import Image from "next/image";

const EditArtwork: NextPageWithLayout = () => {
    const router = useRouter()
    const { id } = router.query;

    const artwork = api.artwork.getOne.useQuery(Number(id))

    const artworkMutation = api.artwork.edit.useMutation();
    const collections = api.collection.list.useQuery();

    const [imageFile, setImageFile] = useState<File>()

    const artworkFields: FieldAttributes[] = [
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "name",
            label: "Name of the Artwork",
            type: FieldType.TEXT,
            defaultValue: artwork.data?.name,
        },
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "dimension",
            label: "Dimensions of the art",
            type: FieldType.TEXT,
            defaultValue: artwork.data?.dimension,
        },
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "description",
            label: "Description",
            type: FieldType.RICHTEXT,
            defaultValue: artwork.data?.description,
        },
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "featured",
            label: "Show this art on the home page?",
            type: FieldType.CHECKBOX,
            defaultValue: artwork.data?.featured,
        },
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "availableForSale",
            label: "Is this art available for sale?",
            type: FieldType.CHECKBOX,
            defaultValue: artwork.data?.availableForSale,
        },
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "price",
            label: "The price for the art?",
            type: FieldType.NUMBER,
            defaultValue: artwork.data?.price,
        },
        {
            id: crypto.randomBytes(16).toString('hex'),
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
            id: crypto.randomBytes(16).toString('hex'),
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
            id: crypto.randomBytes(16).toString('hex'),
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
                const name = imageFile.name
                const storageRef = ref(storage, `image/${name}`)

                const uploadedFile = await uploadBytes(storageRef, imageFile)
                url = await getDownloadURL(uploadedFile.ref)
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

        <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-collections leading-6">Edit artwork</h3>
                    <label className="label mt-2">
                        <span className="label-text">Current artwork image</span>
                    </label>
                    <div className="flex justify-center">
                        {
                            artwork.data?.imageUrl &&
                            <Image
                                src={artwork.data?.imageUrl ?? ""}
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
                                        name="imageUrl" onChange={(files) => handleSelectedFile(files.target.files)} />
                                </div>

                                {artworkFields.map((field) => (
                                    <div className={clsx("col-span-6", field.name != "description" && "sm:col-span-3")} key={field.id}>
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

export default EditArtwork