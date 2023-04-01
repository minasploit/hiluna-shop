import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import Field from "~/components/form/Field";
import type FieldAttribute from "~/components/form/FieldAttributes";
import { FieldType } from "~/components/form/FieldAttributes";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { EditMediaFormSchema } from "~/utils/schema";
import Image from "next/image";
import { resolveUploadResource } from "~/utils/functions";
import { type FtpUploadResult } from "~/pages/api/upload";

const EditMedium: NextPageWithLayout = () => {
    const router = useRouter()
    const { id } = router.query;

    const media = api.medium.getOne.useQuery(Number(id))

    const mediumMutation = api.medium.edit.useMutation();

    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const mediumFields: FieldAttribute[] = [
        {
            name: "name",
            label: "Name of the Media",
            type: FieldType.TEXT,
            defaultValue: media.data?.name
        },
        {
            name: "description",
            label: "Description of the Media",
            type: FieldType.TEXT,
            defaultValue: media.data?.description ?? ""
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
            label: "Featued on the home page?",
            type: FieldType.CHECKBOX,
            defaultValue: media.data?.featured
        },
        {
            name: "featureOrder",
            label: "Order in which the media is shown in the Home Page",
            type: FieldType.NUMBER,
            defaultValue: media.data?.featureOrder
        }
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
            let fileId: number | undefined;

            if (mediumForm.getValues("featured") && !media.data?.featureImageId && !inputFileRef.current?.files?.length) {
                toast.error("Please, select the file you want to use as a feature image", { id: toastId });
                return;
            }

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

                fileId = result.urls[0].fileId
            }

            const res = await mediumMutation.mutateAsync({
                ...data,
                featureImageId: fileId
            });

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

        {
            (media.isLoading || !media.data) &&
            <div className="flex items-center justify-center mt-12">
                {
                    media.isLoading &&
                    <LoadingSpinner />
                }

                {
                    (!media.data && !media.isLoading) &&
                    <div className="card w-96 bg-base-100 shadow-xl border border-red-400">
                        <div className="card-body">
                            <h2 className="card-title">Error</h2>
                            <p>The media selected doesn&apos;t exist.</p>
                            <div className="card-actions justify-end mt-2">
                                <Link href={`/admin/medium`}>
                                    <button className="btn btn-primary btn-sm">Go back</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }

        {
            media.data &&
            <div className="card shadow px-4 py-5 sm:rounded-lg sm:p-6 md:mt-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6">Edit media</h3>
                        {
                            media.data.FeatureImage &&
                            <>
                                <label className="label my-2">
                                    <span className="label-text">Current featured image</span>
                                </label>
                                <div className="flex items-center flex-col">
                                    <Image
                                        src={resolveUploadResource(media.data.FeatureImage?.fileUrl)}
                                        width={320} height={320} alt="Artwork image"
                                        className="w-auto"
                                        priority
                                    />
                                </div>
                            </>
                        }
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
        }


    </>
}

export default EditMedium