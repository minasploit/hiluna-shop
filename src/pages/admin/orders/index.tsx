import { Currency, OrderStatus, PaymentMethod } from "@prisma/client";
import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getArtworkImageUrl, prettifyCamel, resolveUploadResource } from "~/components/Functions";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const ManageOrders: NextPageWithLayout = () => {
    const orders = api.order.list.useQuery();

    return <>
        <Head>
            <title>Manage Orders - Hiluna Art</title>
        </Head>

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
                        <th className="table-header"></th>
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
                        orders.data?.map((order, index) => (
                            <tr key={order.id}>
                                <th>{index + 1}</th>
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