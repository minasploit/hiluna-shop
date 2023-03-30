import { Currency, OrderStatus, PaymentMethod } from "@prisma/client";
import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getArtworkImageUrl, prettifyCamel, resolveUploadResource } from "~/utils/functions";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { hashId } from "~/utils/hashId";
import { useState } from "react";

const ManageOrders: NextPageWithLayout = () => {

    const orders = api.order.list.useQuery();

    const [filterOrderId, setFilterOrderId] = useState<string>("");

    return <>
        <Head>
            <title>Manage Orders - Hiluna Art</title>
        </Head>

        <div className="flex flex-col lg:flex-row justify-between items-center p-8">
            <div>
                <h1 className="text-5xl font-bold">Orders</h1>
                <p className="py-6">Here are your orders</p>
            </div>

            <div className="form-control">
                <div className="input-group">
                    <input type="text" placeholder="Search by Order ID…" className="input input-bordered border-primary" onChange={(e) => setFilterOrderId(e.target.value)} />
                    <button className="btn btn-primary btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto w-full">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th className="table-header">Order ID</th>
                        <th className="table-header">Artworks</th>
                        <th className="table-header">Ordered By</th>
                        <th className="table-header">Phone Number</th>
                        <th className="table-header">Price</th>
                        <th className="table-header">Payment Method</th>
                        <th className="table-header">Screenshot</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Ordered At</th>
                        <th className="table-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.data?.
                            filter(order => hashId.encode(order.id).toLowerCase().includes(filterOrderId.toLowerCase())).
                            map((order) => (
                                <tr key={order.id}>
                                    <th>{hashId.encode(order.id)}</th>
                                    <td>
                                        <Link href={`/admin/orders/${order.id}`} className="flex flex-col gap-2 hover:opacity-75">
                                            {
                                                order.OrderedArtworks.map(orderedArtwork => (
                                                    <div className="flex items-center space-x-3" key={orderedArtwork.artworkId}>
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12">
                                                                <Image
                                                                    src={getArtworkImageUrl(orderedArtwork.Artwork)}
                                                                    alt="Artwork image"
                                                                    width={90}
                                                                    height={90}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">
                                                                {orderedArtwork.Artwork.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </Link>
                                    </td>
                                    <td>{order.OrderedBy.name}</td>
                                    <td>{order.phoneNumber}</td>
                                    <td>
                                        {order.currency == Currency.USD && `$${order.totalPrice.toLocaleString()}`}
                                        {order.currency == Currency.ETB && `${order.totalPrice.toLocaleString()} ${order.currency}`}
                                    </td>
                                    <td>{prettifyCamel(order.paymentMethod)}</td>
                                    <td>
                                        {order.paymentMethod == PaymentMethod.CashOnDelivery && <>Cash on delivery</>}
                                        {
                                            (order.paymentMethod != PaymentMethod.CashOnDelivery && order.Screenshot) &&
                                            <Link className="link" href={resolveUploadResource(order.Screenshot.fileUrl)} target={"_blank"}>
                                                Click to view
                                            </Link>
                                        }
                                    </td>
                                    <td>
                                        <span className={clsx(
                                            order.orderStatus == OrderStatus.Ordered && "text-primary-focus",
                                            order.orderStatus == OrderStatus.OrderedAndPaid && "text-primary",
                                            order.orderStatus == OrderStatus.Cancelled && "text-error",
                                            order.orderStatus == OrderStatus.Completed && "text-base",
                                        )}>
                                            {prettifyCamel(order.orderStatus)}
                                        </span>
                                    </td>
                                    <td>{order.orderedAt.toDateString()}</td>
                                    <th className="text-end">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <button className="btn btn-sm btn-primary btn-outline">Details</button>
                                        </Link>
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