import { api } from "~/utils/api";
import Image from 'next/image'
import { useLocalStorage } from "usehooks-ts";
import { getArtworkImage, resolveUploadResource } from "~/components/Functions";
import { type NextPageWithLayout } from "./_app";
import { type CartItem } from "./cart";

const Test: NextPageWithLayout = () => {

    const [cartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);
    const artworks = api.artwork.list.useQuery();

    return <>
        <div className="">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {artworks.data?.map((artwork) => (
                        <a key={artwork.id} href={`/artworks/${artwork.id}`} className="group">
                            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                <Image
                                    src={resolveUploadResource(getArtworkImage(artwork))}
                                    alt={artwork.name}
                                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                                    width={220} height={220}
                                    priority={true}
                                />
                            </div>
                            <h3 className="mt-4 text-lg font-medium">{artwork.name}</h3>
                            {
                                artwork.availableForSale ?
                                    <p className="mt-1 inline">{artwork.price.toLocaleString()} ETB</p>
                                    :
                                    <p className="mt-1 text-sm inline">Not available for sale</p>
                            }
                            {
                                cartItemIds.map(c => c.id).includes(artwork.id) &&
                                <span className="badge ml-2">In your cart</span>
                            }
                            <div className="mt-1">
                                {artwork.Medium.map(m => (
                                    <span className="badge badge-primary mx-1" key={m.id}>
                                        {m.name}
                                    </span>
                                ))}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </>
}

export default Test