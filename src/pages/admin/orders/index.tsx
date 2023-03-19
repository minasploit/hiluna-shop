import { Currency, PaymentMethod } from "@prisma/client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { prettifyCamel, resolveResource } from "~/components/Functions";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const ManageOrders: NextPageWithLayout = () => {
    const [deleteArtworkId, setDeleteArtworkId] = useState(0);

    const orders = api.order.list.useQuery();
    const deleteArtworkMutation = api.artwork.delete.useMutation();

    async function deleteArtwork(id: number) {
        const toastId = toast.loading("Deleting artwork...");

        try {
            await deleteArtworkMutation.mutateAsync(id);

            toast.success("Artwork deleted", { id: toastId });

            await orders.refetch()
        } catch {
            toast.error("Error deleting artwork", { id: toastId });
        }
    }

    return <>
        <Head>
            <title>Manage Orders - Hiluna Art</title>
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
                <h1 className="text-5xl font-bold">Orders</h1>
                <p className="py-6">Here are your orders</p>
            </div>
        </div>

        <div className="overflow-x-auto w-full">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th></th>
                        <th>Artwork</th>
                        <th>Ordered By</th>
                        <th>Phone Number</th>
                        <th>Price</th>
                        <th>Payment Method</th>
                        <th>Screenshot</th>
                        <th>Status</th>
                        <th>Ordered At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.data?.map((order, index) => (
                            <tr key={order.id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <Image
                                                    src={resolveResource(order.Artwork.imageUrl)}
                                                    alt="Artwork image"
                                                    width={90}
                                                    height={90}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">
                                                {order.Artwork.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{order.OrderedBy.name}</td>
                                <td>{order.phoneNumber}</td>
                                <td>
                                    {order.currency == Currency.USD && `$${order.price}`}
                                    {order.currency == Currency.ETB && `${order.price} ${order.currency}`}
                                    <br />
                                    {/* <span className={clsx("badge", artwork.availableForSale ? "badge-primary" : "badge-ghost")}>
                                        {artwork.availableForSale ? "Available for sale" : "Unavailable for sale"}
                                    </span> */}
                                </td>
                                <td>{prettifyCamel(order.paymentMethod)}</td>
                                <td>
                                    {order.paymentMethod == PaymentMethod.CashOnDelivery && <>Cash on delivery</>}
                                    {
                                        (order.paymentMethod != PaymentMethod.CashOnDelivery && order.screenshotUrl) &&
                                        <Link className="link" href={resolveResource(order.screenshotUrl)}>
                                            Click to view
                                        </Link>
                                    }
                                </td>
                                <td>{order.orderStatus}</td>
                                <td>{order.orderedAt.toDateString()}</td>
                                <th className="text-end">
                                    <Link href={`/admin/artworks/${order.Artwork.id}`}>
                                        <button className="btn btn-outline btn-sm">Edit</button>
                                    </Link>
                                    <label className="btn btn-error btn-sm ml-2" htmlFor="delete-modal" onClick={() => setDeleteArtworkId(order.Artwork.id)}>Delete</label>
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {
                !orders.data?.length &&
                <div className="text-center my-6 text-lg font-medium">No Orders</div>
            }
        </div>
    </>
}

export default ManageOrders