import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const ManageCollection: NextPageWithLayout = () => {
    const [deleteCollectionId, setDeleteCollectionId] = useState(0);

    const collection = api.collection.list.useQuery();
    const deleteCollectionMutation = api.collection.delete.useMutation();

    async function deleteCollection(id: number) {
        const toastId = toast.loading("Deleting collection...");

        try {
            await deleteCollectionMutation.mutateAsync(id);

            toast.success("Collection deleted", { id: toastId });

            await collection.refetch()
        } catch {
            toast.error("Error deleting collection", { id: toastId });
        }
    }

    return <>
        <Head>
            <title>Manage Collections - Hiluna Art</title>
        </Head>

        <input type="checkbox" id="delete-modal" className="modal-toggle" />
        <label htmlFor="delete-modal" className="modal cursor-pointer modal-bottom sm:modal-middle">
            <label className="modal-box relative" htmlFor="">
                <h3 className="text-lg font-bold">Confirm</h3>
                <p className="py-4">Are you sure you want to delete this collection?</p>

                <div className="flex justify-end mt-4">
                    <label
                        htmlFor="delete-modal"
                        className="btn btn-ghost">
                        Cancel
                    </label>
                    <label
                        htmlFor="delete-modal"
                        className="ml-3 btn btn-error"
                        onClick={() => deleteCollection(deleteCollectionId)}>
                        Delete
                    </label>
                </div>
            </label>
        </label>

        <div className="flex flex-col lg:flex-row justify-between items-center p-8">
            <div className="">
                <h1 className="text-5xl font-bold">Collections</h1>
                <p className="py-6">Here are your collections</p>
            </div>
            <Link href="collections/new">
                <button className="btn btn-outline">Add new Collection</button>
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
                        collection.data?.map((collection, index) => (
                            <tr key={collection.id}>
                                <th>{index + 1}</th>
                                <td>
                                    <Link href={`/admin/collections/${collection.id}`} className="hover:opacity-75">
                                        {collection.name}
                                    </Link>
                                </td>
                                <td>{collection.description}</td>
                                <th className="flex gap-2 justify-end">
                                    <Link href={`/admin/collections/${collection.id}`}>
                                        <button className="btn btn-outline btn-sm">Edit</button>
                                    </Link>
                                    <label className="btn btn-error btn-sm" htmlFor="delete-modal" onClick={() => setDeleteCollectionId(collection.id)}>Delete</label>
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {
                !collection.data?.length &&
                <div className="text-center my-6 text-lg font-medium">No Collections</div>
            }
        </div>
    </>
}

export default ManageCollection