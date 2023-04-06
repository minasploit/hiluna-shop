import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";
import { Currency } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { getArtworkImageUrl, getArtworkImage } from "~/utils/functions";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";
import { type CartItem } from "~/components/Cart";
import Head from "next/head";

const Favorites: NextPageWithLayout = () => {
    const artworks = api.favorite.list.useQuery();

    const [cartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);

    return <>
        <Head>
            <title>Favorite Artworks - Hiluna Art</title>
        </Head>

        <main className="max-w-2xl mx-auto px-4 lg:max-w-7xl lg:px-8">
            <div className="border-b border-primary pt-16 pb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                    Favorite Artworks
                </h1>
            </div>

            <div className="pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                <section aria-labelledby="product-heading" className="mt-6 lg:mt-0 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                    <h2 id="product-heading" className="sr-only">
                        Products
                    </h2>

                    {
                        artworks.isLoading &&
                        <div className="flex justify-center">
                            <LoadingSpinner className="w-8 h-8" />
                        </div>
                    }

                    {
                        artworks.data?.length == 0 &&
                        <div className="flex justify-between items-center p-4">
                            <h2 className="text-lg font-medium">
                                No artworks added to favorites
                            </h2>
                        </div>
                    }

                    <div className="columns-1 gap-y-4 sm:columns-2 sm:gap-x-6 sm:gap-y-10 lg:columns-3 lg:gap-x-8 xl:columns-4">
                        {artworks.data?.map((artwork) => (
                            <Link href={`/artworks/${artwork.id}`} key={artwork.id}>
                                <div
                                    className={
                                        clsx("group relative bg-base-200 bg-opacity-30 border rounded-lg flex flex-col overflow-hidden h-fit mb-4 sm:mb-6 md:mb-8")
                                    }
                                >
                                    <div className="aspect-w-3 aspect-h-4 group-hover:opacity-75 sm:aspect-none">
                                        <Image
                                            src={getArtworkImageUrl(artwork)}
                                            alt={artwork.name} width={500} height={500}
                                            priority
                                            blurDataURL={getArtworkImage(artwork).File.blurHash ?? undefined}
                                            placeholder={getArtworkImage(artwork).File.blurHash ? "blur" : "empty"}
                                            className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                                        />
                                    </div>
                                    <div className="flex-1 p-4 space-y-2 flex flex-col">
                                        <h3 className="text-lg font-medium">
                                            {artwork.name}
                                        </h3>
                                        <div className="text- opacity-80">{artwork.shortDescription}</div>
                                        <div className="flex-1 flex flex-col justify-end">
                                            {
                                                artwork.Medium.length != 0 &&
                                                <p className="opacity-90 mt-2 mb-4">
                                                    {artwork.Medium.map(m => (
                                                        <span className="badge badge-primary m-1"
                                                            key={m.id}>
                                                            {m.name}
                                                        </span>
                                                    ))}
                                                </p>
                                            }
                                            <div className="flex justify-between">
                                                <div className="text-lg font-medium">
                                                    {
                                                        artwork.availableForSale ?
                                                            <>
                                                                {artwork.currency == Currency.USD && `$${artwork.price.toLocaleString()}`}
                                                                {artwork.currency == Currency.ETB && `${artwork.price.toLocaleString()} ${artwork.currency}`}
                                                            </>
                                                            :
                                                            <p className="mt-1 text-sm inline">Not available for sale</p>
                                                    }
                                                    {
                                                        cartItemIds.map(c => c.id).includes(artwork.id) &&
                                                        <span className="badge ml-2">In your cart</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main></>
}

export default Favorites