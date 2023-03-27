import clsx from "clsx";
import { type NextPageWithLayout } from "../_app";
import { FiHeart, FiPlayCircle, FiStar } from "react-icons/fi";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Currency, FileType } from "@prisma/client";
import parse from 'html-react-parser'
import { useLocalStorage } from "usehooks-ts";
import { toast } from "react-hot-toast";
import { type CartItem } from "../cart";
import Image from "next/image";
import { resolveUploadResource } from "~/components/Functions";
import Link from "next/link";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Tab } from "@headlessui/react";

const product = {
    // name: 'Zip Tote Basket',
    // price: '$140',
    rating: 4,
    images: [
        {
            id: 1,
            name: 'Angled view',
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
            alt: 'Angled front view with bag zipped and handles upright.',
        },
        // More images...
    ],
    // colors: [
    //     { name: 'Washed Black', bgColor: 'bg-gray-700', selectedColor: 'ring-gray-700' },
    //     { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-400' },
    //     { name: 'Washed Gray', bgColor: 'bg-gray-500', selectedColor: 'ring-gray-500' },
    // ],
    // details: [
    //     {
    //         name: 'Features',
    //         items: [
    //             'Multiple strap configurations',
    //             'Spacious interior with top zip',
    //             'Leather handle and tabs',
    //             'Interior dividers',
    //             'Stainless strap loops',
    //             'Double stitched construction',
    //             'Water-resistant',
    //         ],
    //     },
    //     // More sections...
    // ],
}

const ArtworkDetail: NextPageWithLayout = () => {
    const router = useRouter();
    const { id } = router.query;

    const [cartItemIds, setCartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);

    const artwork = api.artwork.getOne.useQuery(Number(id), { enabled: id != undefined });

    function addToCart() {
        setCartItemIds([
            ...cartItemIds,
            {
                id: Number(id)
            }
        ]);
        toast.success("Added to cart");
    }

    function removeFromCart() {
        setCartItemIds(cartItemIds.filter(c => c.id != Number(id)))
        toast.success("Removed from cart")
    }

    return <>

        {
            (artwork.isLoading || !artwork.data) &&
            <div className="flex items-center justify-center mt-12">
                {
                    artwork.isLoading &&
                    <LoadingSpinner />
                }

                {
                    (!artwork.data && !artwork.isLoading) &&
                    <div className="card w-96 bg-base-100 shadow-xl border border-red-400">
                        <div className="card-body">
                            <h2 className="card-title">Error</h2>
                            <p>The artwork selected doesn&apos;t exist.</p>
                            <div className="card-actions justify-end mt-2">
                                <Link href={`/artworks`}>
                                    <button className="btn btn-primary btn-sm">Go back</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }

        {
            artwork.data &&
            <div className="max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    <Tab.Group as="div" className="flex flex-col-reverse">
                        {/* Image selector */}
                        <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                            <Tab.List className="grid grid-cols-4 gap-6">
                                {artwork.data.Files
                                    .sort((a) => (a.fileType == FileType.Image) ? -1 : 1)
                                    .map((file) => (
                                        <Tab
                                            key={file.id}
                                            className="relative h-24 rounded-md flex items-center justify-center text-sm font-medium uppercase cursor-pointer hover:bg-gray-50"
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className="sr-only">Artwork file</span>
                                                    <span className="absolute inset-0 rounded-md overflow-hidden">
                                                        <div className="relative">
                                                            {
                                                                file.fileType === FileType.Image &&
                                                                <Image
                                                                    src={resolveUploadResource(file.fileUrl)}
                                                                    alt="Artwork image"
                                                                    priority={true}
                                                                    width={120} height={120}
                                                                    className="w-full h-full object-center object-cover sm:rounded-lg"
                                                                />
                                                            }
                                                            {
                                                                file.fileType === FileType.Video &&
                                                                <video
                                                                    src={resolveUploadResource(file.fileUrl)}
                                                                    className="w-full h-full object-center object-cover sm:rounded-lg">
                                                                </video>
                                                            }
                                                        </div>
                                                    </span>
                                                    {
                                                        file.fileType === FileType.Video &&
                                                        <div className="absolute">
                                                            <FiPlayCircle className="w-10 h-10 text-white" />
                                                        </div>
                                                    }
                                                    <span
                                                        className={clsx(
                                                            selected ? 'ring-primary' : 'ring-transparent',
                                                            'absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                </>
                                            )}
                                        </Tab>
                                    ))}
                            </Tab.List>
                        </div>

                        <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                            {artwork.data.Files.map((file) => (
                                <Tab.Panel key={file.id}>
                                    {
                                        file.fileType === FileType.Image &&
                                        <Image
                                            src={resolveUploadResource(file.fileUrl)}
                                            alt="Artwork thumbnail"
                                            priority={true}
                                            width={720} height={720}
                                            className="w-full h-full object-center object-cover sm:rounded-lg"
                                        />
                                    }
                                    {
                                        file.fileType === FileType.Video &&
                                        <video controls className="w-full h-full object-center object-cover sm:rounded-lg">
                                            <source src={resolveUploadResource(file.fileUrl)} type={file.mimeType ?? "video/mp4"} />
                                            Your browser does not support the video tag.
                                        </video>
                                    }
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>

                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight">{artwork.data?.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl">
                                {
                                    artwork.data?.availableForSale &&
                                    <>
                                        {artwork.data?.currency == Currency.USD && `$${artwork.data?.price.toLocaleString()}`}
                                        {artwork.data?.currency == Currency.ETB && `${artwork.data?.price.toLocaleString()} ${artwork.data?.currency}`}
                                    </>
                                }
                            </p>
                        </div>

                        {/* Reviews */}
                        <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <FiStar
                                            key={rating}
                                            className={clsx(
                                                product.rating > rating ? 'text-indigo-500' : 'text-gray-300',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{product.rating} out of 5 stars</p>
                            </div>
                        </div>

                        <div className="my-3">
                            {artwork.data.Medium.map(m => (
                                <span className="badge badge-lg badge-primary mx-1" key={m.id}>
                                    {m.name}
                                </span>
                            ))}
                        </div>

                        <div className="">
                            <h3 className="sr-only">Description</h3>

                            <div
                                className="text-base space-y-6">
                                {parse(artwork.data?.description ?? "")}
                            </div>
                        </div>

                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 mt-4">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium">Dimensions</dt>
                                <dd className="mt-1 text-sm">{artwork.data?.dimension}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium">Orientation</dt>
                                <dd className="mt-1 text-sm">{artwork.data?.orientation}</dd>
                            </div>
                        </dl>

                        {/* Colors */}
                        {/* <div>
                                <h3 className="text-sm text-gray-600">Color</h3>

                                <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2">
                                    <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                                    <div className="flex items-center space-x-3">
                                        {product.colors.map((color) => (
                                            <RadioGroup.Option
                                                key={color.name}
                                                value={color}
                                                className={({ active, checked }) =>
                                                    clsx(
                                                        color.selectedColor,
                                                        active && checked ? 'ring ring-offset-1' : '',
                                                        !active && checked ? 'ring-2' : '',
                                                        '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                                                    )
                                                }
                                            >
                                                <RadioGroup.Label as="p" className="sr-only">
                                                    {color.name}
                                                </RadioGroup.Label>
                                                <span
                                                    aria-hidden="true"
                                                    className={clsx(
                                                        color.bgColor,
                                                        'h-8 w-8 border border-black border-opacity-10 rounded-full'
                                                    )}
                                                />
                                            </RadioGroup.Option>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div> */}

                        <div className="mt-10 flex sm:flex-col1">
                            {
                                artwork.data?.availableForSale &&
                                <>
                                    {
                                        cartItemIds.filter(c => c.id == Number(id)).length == 0 ?
                                            <button
                                                className="btn btn-primary btn-wide"
                                                onClick={addToCart}>
                                                Add to cart
                                            </button>
                                            :
                                            <button
                                                className="btn btn-error btn-wide"
                                                onClick={removeFromCart}>
                                                Remove from cart
                                            </button>
                                    }
                                </>
                            }

                            <button className={clsx("btn ", artwork.data?.availableForSale ? "btn-square btn-outline ml-4 " : "btn-primary gap-2")}>
                                <FiHeart className="text-xl" />
                                {!artwork.data?.availableForSale && "Add to Favorites"}
                            </button>
                        </div>

                        {/* <section aria-labelledby="details-heading" className="mt-12">
                            <h2 id="details-heading" className="sr-only">
                                Additional details
                            </h2>

                            <div className="border-t divide-y divide-gray-200">
                                {product.details.map((detail) => (
                                    <Disclosure as="div" key={detail.name}>
                                        {({ open }) => (
                                            <>
                                                <h3>
                                                    <Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
                                                        <span
                                                            className={clsx(open ? 'text-indigo-600' : 'text-gray-900', 'text-sm font-medium')}
                                                        >
                                                            {detail.name}
                                                        </span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <FiMinus
                                                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <FiPlus
                                                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel as="div" className="pb-6 prose prose-sm">
                                                    <ul role="list">
                                                        {detail.items.map((item) => (
                                                            <li key={item}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </div>
                        </section> */}
                    </div>
                </div>
            </div>
        }
    </>
}

export default ArtworkDetail