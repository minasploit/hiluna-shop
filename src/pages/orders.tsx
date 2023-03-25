import { Currency } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getArtworkImage, prettifyCamel, resolveUploadResource } from "~/components/Functions";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";

const Orders: NextPageWithLayout = () => {

    const router = useRouter();
    const orders = api.order.list.useQuery();

    const { orderId } = router.query;

    return <>
        <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:pb-24 lg:px-8">
            {
                orderId &&
                <div className="max-w-xl mb-12">
                    <h1 className="text-sm font-semibold uppercase tracking-wide text-primary">Thank you!</h1>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">It&apos;s on the way!</p>
                    <p className="mt-2 text-base opacity-75">We&apos;ve received your order #{orderId} and will be with you soon.</p>
                </div>
            }

            <div className="max-w-xl">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Order history</h1>
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
                        orders.isLoading &&
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

                            <div className="rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8 bg-base-200">
                                <dl className="divide-y divide-gray-200 space-y-6 text-sm flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
                                    <div className="flex justify-between sm:block">
                                        <dt className="font-medium text-base-content">Date placed</dt>
                                        <dd className="sm:mt-1 opacity-80">
                                            <time dateTime={order.orderedAt.toLocaleDateString()}>{order.orderedAt.toLocaleDateString()}</time>
                                        </dd>
                                    </div>
                                    <div className="flex justify-between pt-6 sm:block sm:pt-0">
                                        <dt className="font-medium text-base-content">Order number</dt>
                                        <dd className="sm:mt-1 opacity-80">{order.id}</dd>
                                    </div>
                                    <div className="flex justify-between pt-6 font-medium text-base-content sm:block sm:pt-0">
                                        <dt>Total amount</dt>
                                        <dd className="sm:mt-1">
                                            {`${order.price.toLocaleString()} ETB`}
                                        </dd>
                                    </div>
                                </dl>
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
                                        <th scope="col" className="w-0 py-3 font-normal text-right">
                                            Info
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="border-b border-gray-500 divide-y divide-gray-500 text-sm sm:border-t">
                                    {order.Artworks.map((artwork) => (
                                        <tr key={artwork.id}>
                                            <td className="py-6 pr-8">
                                                <div className="flex items-center">
                                                    <Image
                                                        src={resolveUploadResource(getArtworkImage(artwork))}
                                                        alt="Artwork Image" width={100} height={100}
                                                        className="w-16 h-16 object-center object-cover rounded mr-6"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{artwork.name}</div>
                                                        <div className="mt-1 sm:hidden">
                                                            {artwork.currency == Currency.USD && `$${artwork.price.toLocaleString()}`}
                                                            {artwork.currency == Currency.ETB && `${artwork.price.toLocaleString()} ${artwork.currency}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden py-6 pr-8 sm:table-cell">
                                                {artwork.currency == Currency.USD && `$${artwork.price.toLocaleString()}`}
                                                {artwork.currency == Currency.ETB && `${artwork.price.toLocaleString()} ${artwork.currency}`}
                                            </td>
                                            <td className="hidden py-6 pr-8 sm:table-cell">{prettifyCamel(order.orderStatus)}</td>
                                            <td className="py-6 font-medium text-right whitespace-nowrap">
                                                <a href={`/artworks/${artwork.id}`} className="text-primary">
                                                    View<span className="hidden lg:inline"> Artwork</span>
                                                    <span className="sr-only">, {artwork.name}</span>
                                                </a>
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