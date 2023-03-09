import { type NextPageWithLayout } from "~/pages/_app";
import 'react-quill/dist/quill.snow.css'
import { FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddArtworkFormSchema } from "~/utils/schema";
import { type z } from "zod";
import type FieldAttributes from "~/components/form/FieldAttributes";
import crypto from 'crypto';
import { FieldType } from "~/components/form/FieldAttributes";
import Field from "~/components/form/Field";
import clsx from "clsx";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "firebaseConfig";

const artworkFields: FieldAttributes[] = [
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "name",
        label: "Name of the Artwork",
        type: FieldType.TEXT
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "dimension",
        label: "Dimensions of the art",
        type: FieldType.TEXT,
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "description",
        label: "Description",
        type: FieldType.RICHTEXT,
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "featured",
        label: "Show this art on the home page?",
        type: FieldType.CHECKBOX,
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "availableForSale",
        label: "Is this art available for sale?",
        type: FieldType.CHECKBOX,
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "price",
        label: "The price for the art?",
        type: FieldType.NUMBER,
        defaultValue: 0
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "currency",
        label: "Currency",
        type: FieldType.SELECT,
        options: [
            { label: "ETB", value: "ETB" },
            { label: "USD", value: "USD" },
        ]
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "orientation",
        label: "Orientation of the art",
        type: FieldType.SELECT,
        options: [
            { label: "Portrait", value: "Portrait" },
            { label: "Landscape", value: "Landscape" }
        ]
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        name: "collectionId",
        label: "Collection",
        type: FieldType.SELECT,
        valueType: "number",
        options: [
            { label: "None", value: 0 },
        ]
    },
]

const NewArtwork: NextPageWithLayout = () => {

    const artworkMutation = api.artwork.create.useMutation();

    const [imageFile, setImageFile] = useState<File>()

    type AddArtworkFormSchemaType = z.infer<typeof AddArtworkFormSchema>;
    const artworkForm = useForm<AddArtworkFormSchemaType>({
        resolver: zodResolver(AddArtworkFormSchema),
    });

    const handleSelectedFile = (files: FileList | null) => {
        if (files && files[0] && files[0].size < 10000000) {
            setImageFile(files[0])

            console.log(files[0])
        } else {
            alert('File size to large')
        }
    }

    const onSubmit: SubmitHandler<AddArtworkFormSchemaType> = async (data) => {
        const toastId = toast.loading("Saving...");

        try {
            if (imageFile) {
                const name = imageFile.name
                const storageRef = ref(storage, `image/${name}`)


                const uploadedFile = await uploadBytes(storageRef, imageFile)
                const url = await getDownloadURL(uploadedFile.ref)

                const res = await artworkMutation.mutateAsync({
                    ...data,
                    imageUrl: url
                });

                artworkForm.reset(res);

                toast.success("Artwork added.", { id: toastId });
            } else {
                alert('File not found')
            }
        } catch {
            toast.success("Error saving artwork...", { id: toastId });
        }
    };

    return <>
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">New artwork</h3>
                    <p className="mt-1 text-sm text-gray-500">Show your art to the world</p>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <FormProvider {...artworkForm}>
                        <form onSubmit={artworkForm.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="form-control w-full col-span-6">
                                    <label className="label">
                                        <span className="label-text">Pick an image for the artwork</span>
                                    </label>
                                    <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
                                        name="imageUrl" onChange={(files) => handleSelectedFile(files.target.files)} required />
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
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={artworkForm.formState.isSubmitting}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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