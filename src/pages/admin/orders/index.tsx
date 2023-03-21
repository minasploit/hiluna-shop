import { Currency, OrderStatus, PaymentMethod } from "@prisma/client";
import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { prettifyCamel, resolveResource } from "~/components/Functions";
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
                        <th></th>
                        <th>Artworks</th>
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
                                    {
                                        order.Artworks.map(artwork => (
                                            <div className="flex items-center space-x-3" key={artwork.id}>
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <Image
                                                            src={resolveResource(artwork.imageUrl)}
                                                            alt="Artwork image"
                                                            width={90}
                                                            height={90}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">
                                                        {artwork.name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </td>
                                <td>{order.OrderedBy.name}</td>
                                <td>{order.phoneNumber}</td>
                                <td>
                                    {order.currency == Currency.USD && `$${order.price}`}
                                    {order.currency == Currency.ETB && `${order.price} ${order.currency}`}
                                </td>
                                <td>{prettifyCamel(order.paymentMethod)}</td>
                                <td>
                                    {order.paymentMethod == PaymentMethod.CashOnDelivery && <>Cash on delivery</>}
                                    {
                                        (order.paymentMethod != PaymentMethod.CashOnDelivery && order.screenshotUrl) &&
                                        <Link className="link" href={resolveResource(order.screenshotUrl)} target={"_blank"}>
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