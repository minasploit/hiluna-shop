import { Transition, Dialog, Disclosure } from "@headlessui/react";
import parse from 'html-react-parser'
import { Currency } from "@prisma/client";
import clsx from "clsx";
import { useState, Fragment } from "react";
import { FiArrowDown, FiPlus, FiX } from "react-icons/fi";
import { getArtworkImage, resolveUploadResource } from "~/components/Functions";
import { api } from "~/utils/api";
import Image from "next/image";
import { type NextPageWithLayout } from "../_app";
import { useLocalStorage } from "usehooks-ts";
import { type CartItem } from "../cart";
import Link from "next/link";

const filters = [
    {
        id: 'color',
        name: 'Color',
        options: [
            { value: 'white', label: 'White' },
            { value: 'beige', label: 'Beige' },
            { value: 'blue', label: 'Blue' },
            { value: 'brown', label: 'Brown' },
            { value: 'green', label: 'Green' },
            { value: 'purple', label: 'Purple' },
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            { value: 'new-arrivals', label: 'All New Arrivals' },
            { value: 'tees', label: 'Tees' },
            { value: 'crewnecks', label: 'Crewnecks' },
            { value: 'sweatshirts', label: 'Sweatshirts' },
            { value: 'pants-shorts', label: 'Pants & Shorts' },
        ],
    },
    {
        id: 'sizes',
        name: 'Sizes',
        options: [
            { value: 'xs', label: 'XS' },
            { value: 's', label: 'S' },
            { value: 'm', label: 'M' },
            { value: 'l', label: 'L' },
            { value: 'xl', label: 'XL' },
            { value: '2xl', label: '2XL' },
        ],
    },
]

const Artworks: NextPageWithLayout = () => {

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [cartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);
    const artworks = api.artwork.list.useQuery();

    return <>
        <div>
            {/* Mobile filter dialog */}
            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <div className="ml-auto relative max-w-xs w-full h-full bg-base-100 shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
                            <div className="px-4 flex items-center justify-between">
                                <h2 className="text-lg font-medium">Filters</h2>
                                <button
                                    type="button"
                                    className="-mr-2 w-10 h-10 p-2 flex items-center justify-center"
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <FiX className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Filters */}
                            <form className="mt-4">
                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.name} className="border-t border-gray-500 pt-4 pb-4">
                                        {({ open }) => (
                                            <fieldset>
                                                <legend className="w-full px-2">
                                                    <Disclosure.Button className="w-full p-2 flex items-center justify-between">
                                                        <span className="text-sm font-medium">{section.name}</span>
                                                        <span className="ml-6 h-7 flex items-center">
                                                            <FiArrowDown
                                                                className={clsx(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Disclosure.Button>
                                                </legend>
                                                <Disclosure.Panel className="pt-4 pb-2 px-4">
                                                    <div className="space-y-6">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    id={`${section.id}-${optionIdx}-mobile`}
                                                                    name={`${section.id}[]`}
                                                                    defaultValue={option.value}
                                                                    type="checkbox"
                                                                    className="h-4 w-4 border-gray-500 rounded text-primary"
                                                                />
                                                                <label
                                                                    htmlFor={`${section.id}-${optionIdx}-mobile`}
                                                                    className="ml-3 text-sm"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </fieldset>
                                        )}
                                    </Disclosure>
                                ))}
                            </form>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>

            <main className="max-w-2xl mx-auto px-4 lg:max-w-7xl lg:px-8">
                <div className="border-b border-gray-500 pt-24 pb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight">My Artworks</h1>
                    <p className="mt-4 text-base opacity-70">
                        Checkout out the latest release of Basic Tees, new and improved with four openings!
                    </p>
                </div>

                <div className="pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                    <aside>
                        <h2 className="sr-only">Filters</h2>

                        <button
                            type="button"
                            className="inline-flex items-center lg:hidden"
                            onClick={() => setMobileFiltersOpen(true)}
                        >
                            <span className="text-sm font-medium">Filters</span>
                            <FiPlus className="flex-shrink-0 ml-1 h-5 w-5" aria-hidden="true" />
                        </button>

                        <div className="hidden lg:block">
                            <form className="divide-y divide-gray-500 space-y-10">
                                {filters.map((section, sectionIdx) => (
                                    <div key={section.name} className={sectionIdx === 0 ? "" : 'pt-10'}>
                                        <fieldset>
                                            <legend className="block text-sm font-medium">{section.name}</legend>
                                            <div className="pt-6 space-y-3">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            id={`${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            defaultValue={option.value}
                                                            type="checkbox"
                                                            className="h-4 w-4 border-gray-500 rounded text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label htmlFor={`${section.id}-${optionIdx}`} className="ml-3 text-sm">
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                ))}
                            </form>
                        </div>
                    </aside>

                    <section aria-labelledby="product-heading" className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3">
                        <h2 id="product-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="columns-1 gap-y-4 sm:columns-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:columns-3">
                            {
                                artworks.data?.length == 0 &&
                                <div className="flex justify-between items-center p-4">
                                    <h2 className="text-lg font-medium">
                                        No artworks published yet.
                                    </h2>
                                </div>
                            }
                            {artworks.data?.map((artwork) => (
                                <Link href={`/artworks/${artwork.id}`} key={artwork.id}>
                                    <div
                                        className="group relative bg-base-200 border border-gray-200 rounded-lg flex flex-col overflow-hidden h-fit mb-4 sm:mb-6 md:mb-8"
                                    >
                                        <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none">
                                            <Image
                                                src={resolveUploadResource(getArtworkImage(artwork))}
                                                alt={artwork.name} width={500} height={500}
                                                className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                                            />
                                        </div>
                                        <div className="flex-1 p-4 space-y-2 flex flex-col">
                                            <h3 className="text-sm font-medium">
                                                {artwork.name}
                                            </h3>
                                            <div className="text-sm opacity-70">{parse(artwork.description)}</div>
                                            <div className="flex-1 flex flex-col justify-end">
                                                <p className="text-sm opacity-70 mb-1">
                                                    {artwork.Medium.map(m => (
                                                        <span className="badge badge-primary mx-1" key={m.id}>
                                                            {m.name}
                                                        </span>
                                                    ))}
                                                </p>
                                                <p className="text-base font-medium">
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
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </>
}

export default Artworks;