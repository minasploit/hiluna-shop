import { Currency } from "@prisma/client";
import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import { resolveResource } from "~/components/Functions";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const ManageArtworks: NextPageWithLayout = () => {
    const [deleteArtworkId, setDeleteArtworkId] = useState(0);

    const artworks = api.artwork.list.useQuery();
    const deleteArtworkMutation = api.artwork.delete.useMutation();

    async function deleteArtwork(id: number) {
        const toastId = toast.loading("Deleting artwork...");

        try {
            await deleteArtworkMutation.mutateAsync(id);

            toast.success("Artwork deleted", { id: toastId });

            await artworks.refetch()
        } catch {
            toast.error("Error deleting artwork", { id: toastId });
        }
    }

    return <>
        <Head>
            <title>Manage Artworks - Hiluna Art</title>
        </Head>

        <input type="checkbox" id="delete-modal" className="modal-toggle" />
        <label htmlFor="delete-modal" className="modal cursor-pointer modal-bottom sm:modal-middle">
            <label className="modal-box relative" htmlFor="">
                <h3 className="text-lg font-bold">Confirm</h3>
                <p className="py-4">Are you sure you want to delete this artwork?</p>

                <div className="flex justify-end mt-4">
                    <label
                        htmlFor="delete-modal"
                        className="btn btn-ghost">
                        Cancel
                    </label>
                    <label
                        htmlFor="delete-modal"
                        className="ml-3 btn btn-error"
                        onClick={() => deleteArtwork(deleteArtworkId)}>
                        Delete
                    </label>
                </div>
            </label>
        </label>

        <div className="flex flex-col lg:flex-row justify-between items-center p-8">
            <div className="">
                <h1 className="text-5xl font-bold">Artworks</h1>
                <p className="py-6">Here are your artworks</p>
            </div>
            <Link href="artworks/new">
                <button className="btn btn-outline">Add new artwork</button>
            </Link>
        </div>

        <div className="overflow-x-auto w-full">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Dimension</th>
                        <th>Medium</th>
                        <th>Orientation</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        artworks.data?.map((artwork, index) => (
                            <tr key={artwork.id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                {
                                                    artwork.Files.map(f => (
                                                        <Image
                                                            key={f.id}
                                                            src={resolveResource(f.fileUrl)}
                                                            alt="Artwork image"
                                                            width={90}
                                                            height={90}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">
                                                {artwork.name}
                                                {artwork.featured && <FiCheckCircle className="inline ml-2 text-primary" />}
                                            </div>
                                            <div className="text-sm opacity-50">{artwork.Collection?.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{artwork.dimension}</td>
                                <td>
                                    {artwork.Medium.map(m => (
                                        <span className="badge mx-1" key={m.id}>
                                            {m.name}
                                        </span>
                                    ))}
                                </td>
                                <td>{artwork.orientation}</td>
                                <td>
                                    {artwork.currency == Currency.USD && `$${artwork.price.toLocaleString()}`}
                                    {artwork.currency == Currency.ETB && `${artwork.price.toLocaleString()} ${artwork.currency}`}
                                    <br />
                                    <span className={clsx("badge", artwork.availableForSale ? "badge-primary" : "badge-ghost")}>
                                        {artwork.availableForSale ? "Available for sale" : "Unavailable for sale"}
                                    </span>
                                </td>
                                <th className="text-end">
                                    <Link href={`/admin/artworks/${artwork.id}`}>
                                        <button className="btn btn-outline btn-sm">Edit</button>
                                    </Link>
                                    <label className="btn btn-error btn-sm ml-2" htmlFor="delete-modal" onClick={() => setDeleteArtworkId(artwork.id)}>Delete</label>
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {
                !artworks.data?.length &&
                <div className="text-center my-6 text-lg font-medium">No Artworks</div>
            }
        </div>
    </>
}

export default ManageArtworks