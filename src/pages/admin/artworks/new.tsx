import { useState } from "react";
import { type NextPageWithLayout } from "~/pages/_app";
import 'react-quill/dist/quill.snow.css'
import dynamic from "next/dynamic";
import { useFormik } from "formik";
import * as yup from 'yup'

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const NewArtwork: NextPageWithLayout = () => {

    const [description, setDescription] = useState("");

    const artworkForm = useFormik({
        initialValues: {
            name: ""
        },
        validationSchema: yup.object({
            name: yup.string().required()
        }),
        onSubmit: ({ name }) => {
            console.log(name, description);
        }
    })

    return <>
        <div>
            <div className="md:grid md:grid-cols-3 md:gap-6 md:mt-8 mt-4">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base font-semibold leading-6">New Artwork</h3>
                        <p className="mt-1 text-sm">
                            Share a new artwork to the world.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <form action="#" method="POST">
                        <div className="card shadow-xl sm:overflow-hidden sm:rounded-md">
                            <div className="space-y-6 card-body px-4 py-5 sm:p-6">
                                <div className="grid grid-cols1 gap-6">
                                    <div className="col-span-1">
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text">Name of the artwork</span>
                                            </label>
                                            <input type="text" className="input input-bordered w-full" name="name" value={artworkForm.values.name} onChange={artworkForm.handleChange} />
                                            {artworkForm.errors.name && <span className="text-red-500">{artworkForm.errors.name}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Description for the artwork</span>
                                        </label>
                                        <ReactQuill
                                            theme='snow'
                                            value={description}
                                            onChange={setDescription}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Cover photo</label>
                                    <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary" onClick={() => void artworkForm.submitForm()}>Save</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default NewArtwork