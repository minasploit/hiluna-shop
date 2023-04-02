import { Transition, Dialog, Disclosure } from "@headlessui/react";
import { Currency } from "@prisma/client";
import clsx from "clsx";
import { useState, Fragment, useEffect, type SyntheticEvent } from "react";
import { FiArrowDown, FiPlus, FiX } from "react-icons/fi";
import { getArtworkImage, getArtworkImageUrl, splitStringByLength } from "~/utils/functions";
import { api } from "~/utils/api";
import Image from "next/image";
import { type NextPageWithLayout } from "../_app";
import { useLocalStorage } from "usehooks-ts";
import { type CartItem } from "../../components/Cart";
import Link from "next/link";
import styles from './artworks.module.css'
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { hashId } from "~/utils/hashId";
import { useMemo } from "react";
import { env } from "~/env.mjs";
import { useSession } from "next-auth/react";
import { AiFillHeart } from "react-icons/ai"
import { FieldType } from "~/components/form/FieldAttributes";

const Artworks: NextPageWithLayout = () => {

    const router = useRouter();

    const { data: session } = useSession();

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [queryFilters, setQueryFilters] = useState<{
        medium: number[],
        collection: number
    }>({ medium: [], collection: 0 });

    const [cartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);

    const artworks = api.artwork.list.useQuery({
        filters: queryFilters
    });
    const medium = api.medium.listForFilter.useQuery();
    const collections = api.collection.listForFilter.useQuery();

    const defaultFilters = useMemo(() => ({
        medium: typeof router.query.m == "string" ? (splitStringByLength(router.query.m ?? "", Number(env.NEXT_PUBLIC_HASHID_LENGTH))?.map(m => hashId.decode(m)) ?? []) : [],
        collection: typeof router.query.c == "string" ? hashId.decode(splitStringByLength(router.query.c ?? "", Number(env.NEXT_PUBLIC_HASHID_LENGTH))?.[0] ?? "") : 0,
    }), [router.query.c, router.query.m])

    const filters = [
        {
            id: 'medium',
            name: 'Medium',
            options: medium.data?.map(m => ({ value: m.id, label: m.name })),
            type: FieldType.CHECKBOX
        },
        {
            id: 'collection',
            name: 'Collection',
            options: collections.data?.map(m => ({ value: m.id, label: m.name })),
            type: FieldType.SELECT
        },
    ]

    const filtersForm = useForm<{
        medium: number[],
        mediumMobile: number[],
        collection: number,
        collectionMobile: number
    }>({
        defaultValues: {
            medium: defaultFilters.medium,
            mediumMobile: defaultFilters.medium,
            collection: defaultFilters.collection,
            collectionMobile: defaultFilters.collection
        }
    })

    useEffect(() => {
        setQueryFilters(defaultFilters)

        if (!filtersForm.formState.isDirty) {
            filtersForm.setValue("medium", defaultFilters.medium)
            filtersForm.setValue("mediumMobile", defaultFilters.medium)

            filtersForm.setValue("collection", defaultFilters.collection)
            filtersForm.setValue("collectionMobile", defaultFilters.collection)
        }
    }, [defaultFilters, filtersForm]);

    function applyFilter(e: SyntheticEvent, filterType: 'default' | 'mobile') {

        console.log(filtersForm.getValues("medium"));

        if (filterType == "default") {
            filtersForm.setValue("mediumMobile", filtersForm.getValues("medium"))
            filtersForm.setValue("collectionMobile", filtersForm.getValues("collection"))
        }

        if (filterType == "mobile") {
            filtersForm.setValue("medium", filtersForm.getValues("mediumMobile"))
            filtersForm.setValue("collection", filtersForm.getValues("collectionMobile"))
        }

        let medium = filtersForm.getValues("medium") ? filtersForm.getValues("medium").map(m => Number(m)) : [];
        const collection = filtersForm.getValues("collection");

        // filter duplicates
        medium = [...new Set(medium)]

        setQueryFilters({
            medium,
            collection
        });

        const mediumQuery = medium.length != 0 ?
            `m=${medium.map(m => hashId.encode(m)).join('')}` : ""

        const collectionQuery = collection != 0 ?
            `c=${hashId.encode(collection)}` : ""

        void router.push({
            query: [mediumQuery, collectionQuery].filter(q => q != "").join("&")
        });
    }

    return <>
        <FormProvider {...filtersForm}>
            <form>
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
                                <div className="mt-4">
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
                                                            {
                                                                section.type == FieldType.CHECKBOX &&
                                                                section.options?.map((option, optionIdx) => (
                                                                    <div key={option.value} className="flex items-center">
                                                                        <div className="form-control">
                                                                            <label className="label cursor-pointer" htmlFor={`${section.id}-${optionIdx}-mobile`}>
                                                                                <input className="checkbox checkbox-primary"
                                                                                    type="checkbox"
                                                                                    value={option.value}
                                                                                    {...filtersForm.register(
                                                                                        (section.id == "medium" ? `mediumMobile` : `collectionMobile`),
                                                                                        {
                                                                                            onChange: (e: SyntheticEvent) => applyFilter(e, "mobile")
                                                                                        })}
                                                                                    id={`${section.id}-${optionIdx}-mobile`}
                                                                                    defaultChecked={defaultFilters.medium?.includes(option.value)}
                                                                                />
                                                                                <span className="label-text ml-3">{option.label}</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                            {
                                                                section.type == FieldType.SELECT &&
                                                                <div className="flex items-center">
                                                                    <div className="form-control">
                                                                        <label className="label" htmlFor={section.id}>
                                                                            <span className="label-text">{section.name}</span>
                                                                        </label>
                                                                        <select className="select select-bordered"
                                                                            {...filtersForm.register(
                                                                                (section.id == "medium" ? "mediumMobile" : "collectionMobile"),
                                                                                {
                                                                                    onChange: (e: SyntheticEvent) => applyFilter(e, "mobile")
                                                                                })}
                                                                            id={`${section.id}-mobile`}
                                                                            value={defaultFilters.collection}>

                                                                            {section.options?.map((option) => (
                                                                                <option key={option.value} value={option.value}>
                                                                                    {option.label}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </Disclosure.Panel>
                                                </fieldset>
                                            )}
                                        </Disclosure>
                                    ))}
                                </div>
                            </div>
                        </Transition.Child>
                    </Dialog>
                </Transition.Root>

                <main className="max-w-2xl mx-auto px-4 lg:max-w-7xl lg:px-8">
                    <div className="border-b border-primary pt-24 pb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                            {
                                filtersForm.getValues("collection") != 0 ?
                                    collections.data?.filter(c => c.id == filtersForm.getValues("collection"))[0]?.name :
                                    <>
                                        {
                                            queryFilters.medium.length == 1 ? medium.data?.filter(m => queryFilters.medium[0] == m.id)[0]?.name : ""
                                        }
                                        {` `} Artworks
                                    </>
                            }
                        </h1>
                        <p className="mt-4 text-base">
                            Checkout out the latest release of Basic Tees, new and improved with four openings!
                        </p>
                    </div>

                    <div className="pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                        <aside className="sm:h-fit sm:sticky sm:top-32">
                            <h2 className="sr-only">Filters</h2>

                            <button
                                type="button"
                                className="btn btn-link btn-primary inline-flex items-center lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="text-sm font-medium">Filters</span>
                                <FiPlus className="flex-shrink-0 ml-1 h-5 w-5" aria-hidden="true" />
                            </button>

                            {
                                queryFilters.medium.length != 0 &&
                                <div className="sm:hidden mt-2">
                                    Applied filters: {" "}
                                    {
                                        queryFilters.medium.map((m, i) => (
                                            <span key={i} className="badge mr-1">
                                                {medium.data?.filter(media => media.id == m)[0]?.name}
                                            </span>
                                        ))
                                    }
                                </div>
                            }

                            <div className="hidden lg:block">
                                <div className="divide-y divide-gray-500 space-y-10">
                                    {filters.map((section, sectionIdx) => (
                                        <div key={section.name} className={sectionIdx === 0 ? "" : 'pt-10'}>
                                            <fieldset>
                                                <legend className="block text-sm font-medium">Filter by {section.name}</legend>
                                                <div className="pt-6 space-y-3">
                                                    {
                                                        section.type == FieldType.CHECKBOX &&
                                                        section.options?.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <div className="form-control">
                                                                    <label className="label cursor-pointer" htmlFor={`${section.id}-${optionIdx}`}>
                                                                        <input className="checkbox checkbox-primary"
                                                                            type="checkbox"
                                                                            value={option.value}
                                                                            {...filtersForm.register(
                                                                                (section.id == "medium" ? `medium` : "collection"),
                                                                                {
                                                                                    onChange: (e: SyntheticEvent) => applyFilter(e, "default")
                                                                                })}
                                                                            id={`${section.id}-${optionIdx}`}
                                                                            defaultChecked={defaultFilters.medium?.includes(option.value)}
                                                                        />
                                                                        <span className="label-text ml-3">{option.label}</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    {
                                                        section.type == FieldType.SELECT &&
                                                        <div className="flex items-center">
                                                            <div className="form-control">
                                                                <label className="label" htmlFor={section.id}>
                                                                    <span className="label-text">{section.name}</span>
                                                                </label>
                                                                <select className="select select-bordered"
                                                                    {...filtersForm.register(
                                                                        (section.id == "medium" ? "medium" : "collection"),
                                                                        {
                                                                            onChange: (e: SyntheticEvent) => applyFilter(e, "default"),
                                                                            valueAsNumber: true,
                                                                        })}
                                                                    id={`${section.id}`}
                                                                    value={defaultFilters.collection}>

                                                                    {section.options?.map((option) => (
                                                                        <option key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </fieldset>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <section aria-labelledby="product-heading" className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3">
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
                                JSON.stringify(filtersForm.watch(), null, 2)
                            }

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
                                            className={
                                                clsx("group relative bg-base-200 bg-opacity-30 border rounded-lg flex flex-col overflow-hidden h-fit mb-4 sm:mb-6 md:mb-8",
                                                    styles.artworkBorder)
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
                                                    <div className="text-sm opacity-60">{artwork.Collection?.name}</div>
                                                </h3>
                                                <div className="text- opacity-80">{artwork.shortDescription}</div>
                                                <div className="flex-1 flex flex-col justify-end">
                                                    {
                                                        artwork.Medium.length != 0 &&
                                                        <p className="opacity-90 mt-2 mb-4">
                                                            {/* {artwork.Medium.map(m => (
                                                                <span className={clsx("badge m-1",
                                                                    filtersForm.getValues("medium") &&
                                                                        filtersForm.getValues("medium")?.includes(m.id) ?
                                                                        "badge-primary" :
                                                                        "badge-primary badge-outline")}
                                                                    key={m.id}>
                                                                    {m.name}
                                                                </span>
                                                            ))} */}
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
                                                        {
                                                            artwork.FavoritedBy.filter(f => f.id == session?.user.id).length != 0 &&
                                                            <AiFillHeart className="text-2xl leading-relaxed text-primary mt-1" />
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </form>
        </FormProvider>
    </>
}

export default Artworks;