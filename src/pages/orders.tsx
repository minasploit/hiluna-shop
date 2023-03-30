import { Currency } from "@prisma/client";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getArtworkImageUrl, prettifyCamel, resolveUploadResource } from "~/utils/functions";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";
import { hashId } from "~/utils/hashId";
import { type NextPageWithLayout } from "./_app";

const Orders: NextPageWithLayout = () => {

    const router = useRouter();
    const { orderId } = router.query;

    const { status } = useSession();

    const orders = api.order.list.useQuery(undefined, {
        enabled: status == "authenticated"
    });

    useEffect(() => {
        if (status == "unauthenticated") {
            void router.push("/")
        }
    }, [router, status])

    return <>
        <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:pb-24 lg:px-8">
            {
                orderId &&
                <div className="max-w-xl mb-12">
                    <h1 className="text-sm font-semibold uppercase tracking-wide text-primary">Thank you!</h1>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">It&apos;s on the way!</p>
                    <p className="mt-2 text-base opacity-75">We&apos;ve received your order #{orderId} and we will contact you soon.</p>
                </div>
            }

            <div className="max-w-xl">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-primary-focus">Order history</h1>
                <p className="mt-1 text-sm">
                    Check the status of recent orders, and manage returns.
                </p>
            </div>

            <section aria-labelledby="recent-heading" className="mt-16">
                <h2 id="recent-heading" className="sr-only">
                    Recent orders
                </h2>

                <div className="space-y-20">
                    {
                        (orders.isLoading && status == "authenticated") &&
                        <div className="flex items-center justify-center mt-12">
                            <LoadingSpinner />
                        </div>
                    }
                    {
                        orders.data?.length == 0 &&
                        <div className="flex justify-between items-center p-4">
                            <h2 className="text-xl font-medium">
                                You have no orders yet
                            </h2>
                            <Link href="/artworks">
                                <button className="btn btn-link">Browse Artworks</button>
                            </Link>
                        </div>
                    }
                    {orders.data?.map((order) => (
                        <div key={order.id}>
                            <h3 className="sr-only">
                                Order placed on <time dateTime={order.orderedAt.toLocaleDateString()}>{order.orderedAt.toLocaleDateString()}</time>
                            </h3>

                            <div className={clsx(
                                "rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8 bg-base-200 border border-primary",
                                Number(orderId) == order.id && "border-[3px] border-primary"
                            )}>
                                <dl className="divide-y divide-gray-200 space-y-6 text-sm flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
                                    <div className="flex justify-between sm:block">
                                        <dt className="font-medium text-base-content">Date placed</dt>
                                        <dd className="sm:mt-1 opacity-80">
                                            <time dateTime={order.orderedAt.toLocaleDateString()}>{order.orderedAt.toLocaleDateString()}</time>
                                        </dd>
                                    </div>
                                    <div className="flex justify-between pt-6 sm:block sm:pt-0">
                                        <dt className="font-medium text-base-content">Order number</dt>
                                        <dd className="sm:mt-1 opacity-80">{hashId.encode(order.id)}</dd>
                                    </div>
                                    <div className="flex justify-between pt-6 sm:block sm:pt-0">
                                        <dt className="font-medium text-base-content">Payment Method</dt>
                                        <dd className="sm:mt-1 opacity-80">{prettifyCamel(order.paymentMethod)}</dd>
                                    </div>
                                    {
                                        order.Screenshot &&
                                        <div className="flex justify-between pt-6 sm:block sm:pt-0">
                                            <dt className="font-medium text-base-content">Screenshot</dt>
                                            <dd className="sm:mt-1 opacity-80">
                                                <Link href={resolveUploadResource(order.Screenshot.fileUrl)} target={"_blank"}>
                                                    View File
                                                </Link>
                                            </dd>
                                        </div>
                                    }
                                    <div className="flex justify-between pt-6 font-medium text-base-content sm:block sm:pt-0">
                                        <dt>Total amount</dt>
                                        <dd className="sm:mt-1">
                                            {`${order.totalPrice.toLocaleString()} ETB`}
                                        </dd>
                                    </div>
                                </dl>

                                {
                                    Number(orderId) == order.id &&
                                    <h1 className="font-semibold uppercase tracking-wide text-primary text-center mt-6 sm:mt-0">Thank you for your order!</h1>
                                }
                            </div>

                            <table className="mt-4 w-full sm:mt-6">
                                <caption className="sr-only">Artworks</caption>
                                <thead className="sr-only text-sm text-left sm:not-sr-only">
                                    <tr>
                                        <th scope="col" className="sm:w-2/5 lg:w-1/3 pr-8 py-3 font-normal">
                                            Artwork
                                        </th>
                                        <th scope="col" className="hidden w-1/5 pr-8 py-3 font-normal sm:table-cell">
                                            Price
                                        </th>
                                        <th scope="col" className="hidden pr-8 py-3 font-normal sm:table-cell">
                                            Status
                                        </th>
                                        <th scope="col" className="w-0 py-3 font-normal text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="border-b border-gray-500 divide-y divide-gray-500 text-sm sm:border-t">
                                    {order.OrderedArtworks.map((orderedArtwork) => (
                                        <tr key={`${order.id} ${orderedArtwork.artworkId}`}>
                                            <td className="py-6 pr-8">
                                                <Link href={`/artworks/${orderedArtwork.artworkId}`} className="hover:opacity-75">
                                                    <div className="flex items-center">
                                                        <Image
                                                            src={getArtworkImageUrl(orderedArtwork.Artwork)}
                                                            alt="Artwork Image" width={100} height={100}
                                                            className="w-16 h-16 object-center object-cover rounded mr-6"
                                                        />
                                                        <div>
                                                            <div className="font-medium">
                                                                {orderedArtwork.Artwork.name}
                                                            </div>
                                                            <div className="mt-1 sm:hidden">
                                                                {orderedArtwork.currency == Currency.USD && `$${orderedArtwork.price.toLocaleString()}`}
                                                                {orderedArtwork.currency == Currency.ETB && `${orderedArtwork.price.toLocaleString()} ${orderedArtwork.currency}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="hidden py-6 pr-8 sm:table-cell">
                                                {orderedArtwork.currency == Currency.USD && `$${orderedArtwork.price.toLocaleString()}`}
                                                {orderedArtwork.currency == Currency.ETB && `${orderedArtwork.price.toLocaleString()} ${orderedArtwork.currency}`}
                                            </td>
                                            <td className="hidden py-6 pr-8 sm:table-cell">{prettifyCamel(order.orderStatus)}</td>
                                            <td className="py-6 font-medium text-right whitespace-nowrap">
                                                <Link href={`/artworks/${orderedArtwork.Artwork.id}`} className="text-primary">
                                                    View<span className="hidden lg:inline"> Artwork</span>
                                                    <span className="sr-only">, {orderedArtwork.Artwork.name}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    </>
}

export default Orders