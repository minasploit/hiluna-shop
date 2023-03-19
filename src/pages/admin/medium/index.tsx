import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const ManageMedium: NextPageWithLayout = () => {
    const [deleteMediaId, setDeleteMediaId] = useState(0);

    const medium = api.medium.list.useQuery();
    const deleteMediaMutation = api.medium.delete.useMutation();

    async function deleteMedia(id: number) {
        const toastId = toast.loading("Deleting media...");

        try {
            await deleteMediaMutation.mutateAsync(id);

            toast.success("Media deleted", { id: toastId });

            await medium.refetch()
        } catch {
            toast.error("Error deleting media", { id: toastId });
        }
    }

    return <>
        <Head>
            <title>Manage Medium - Hiluna Art</title>
        </Head>

        <input type="checkbox" id="delete-modal" className="modal-toggle" />
        <label htmlFor="delete-modal" className="modal cursor-pointer modal-bottom sm:modal-middle">
            <label className="modal-box relative" htmlFor="">
                <h3 className="text-lg font-bold">Confirm</h3>
                <p className="py-4">Are you sure you want to delete this media?</p>

                <div className="flex justify-end mt-4">
                    <label
                        htmlFor="delete-modal"
                        className="btn btn-ghost">
                        Cancel
                    </label>
                    <label
                        htmlFor="delete-modal"
                        className="ml-3 btn btn-error"
                        onClick={() => deleteMedia(deleteMediaId)}>
                        Delete
                    </label>
                </div>
            </label>
        </label>

        <div className="flex flex-col lg:flex-row justify-between items-center p-8">
            <div className="">
                <h1 className="text-5xl font-bold">Medium</h1>
                <p className="py-6">Here are your medium</p>
            </div>
            <Link href="medium/new">
                <button className="btn btn-outline">Add new Media</button>
            </Link>
        </div>

        <div className="overflow-x-auto w-full">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        medium.data?.map((media, index) => (
                            <tr key={media.id}>
                                <th>{index + 1}</th>
                                <td>{media.name}</td>
                                <td>{media.description}</td>
                                <th className="flex gap-2 justify-end">
                                    <Link href={`/admin/medium/${media.id}`}>
                                        <button className="btn btn-outline btn-sm">Edit</button>
                                    </Link>
                                    <label className="btn btn-error btn-sm" htmlFor="delete-modal" onClick={() => setDeleteMediaId(media.id)}>Delete</label>
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {
                !medium.data?.length &&
                <div className="text-center my-6 text-lg font-medium">No Medium</div>
            }
        </div>
    </>
}

export default ManageMedium