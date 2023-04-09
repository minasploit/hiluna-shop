import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiCheck, FiChevronDown, FiPaperclip } from "react-icons/fi";
import { getArtworkImageUrl, prettifyCamel, resolveUploadResource } from "~/utils/functions";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import Image from "next/image";
import { Currency, OrderStatus } from "@prisma/client";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { hashId } from "~/utils/hashId";

interface OrderStatusOption {
    title: string;
    description?: string,
    current: boolean,
    value: OrderStatus
}

const orderStatusOptions: OrderStatusOption[] = [
    { title: 'Ordered', description: 'Ordered but not paid. Cash on Delivery.', current: false, value: OrderStatus.Ordered },
    { title: 'Ordered and Paid', description: 'Not delivered yet.', current: false, value: OrderStatus.OrderedAndPaid },
    { title: 'Cancelled', current: false, value: OrderStatus.Cancelled },
    { title: 'Completed', description: 'Delivered to customer.', current: false, value: OrderStatus.Completed },
]

const ManageOrder: NextPageWithLayout = () => {
    const router = useRouter()
    const { id } = router.query;

    const order = api.order.getOne.useQuery(Number(id))
    const changeOrderStatusMutation = api.order.changeOrderStatus.useMutation();

    const [selected, setSelected] = useState(orderStatusOptions[0])

    useEffect(() => {
        setSelected(orderStatusOptions.filter(s => s.value == order.data?.orderStatus)[0]);
    }, [order.data?.orderStatus])

    async function orderStatusChanged(data: OrderStatusOption) {
        const toastId = toast.loading("Changing order status...");

        try {
            await changeOrderStatusMutation.mutateAsync({
                id: Number(id),
                orderStatus: data.value
            })

            setSelected(data);
            await order.refetch();

            toast.success("Order status changed.", { id: toastId })
        } catch {
            toast.error("Error changing order status", { id: toastId })
        }
    }

    return <>
        <Head>
            <title>View Order - Hiluna Art</title>
        </Head>

        {
            (order.isLoading || !order.data) &&
            <div className="flex items-center justify-center mt-12">
                {
                    order.isLoading &&
                    <LoadingSpinner />
                }

                {
                    (!order.data && !order.isLoading) &&
                    <div className="card w-96 bg-base-100 shadow-xl border border-red-400">
                        <div className="card-body">
                            <h2 className="card-title">Error</h2>
                            <p>The order selected doesn&apos;t exist.</p>
                            <div className="card-actions justify-end mt-2">
                                <Link href={`/admin/orders`}>
                                    <button className="btn btn-primary btn-sm">Go back</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }

        {
            order.data &&
            <div className="shadow-xl sm:rounded-lg md:mt-8">
                <div className="flex px-4 py-5 sm:px-6 justify-between">
                    <div>
                        <h3 className="text-lg leading-6 font-medium">Order Information</h3>
                        <p className="mt-1 max-w-2xl text-sm">Personal details and application.</p>
                    </div>

                    <Listbox value={selected} onChange={orderStatusChanged}
                        disabled={changeOrderStatusMutation.isLoading}
                        defaultValue={orderStatusOptions.filter(s => s.value == order.data?.orderStatus)[0]}
                    >
                        {({ open }) => (
                            <>
                                <Listbox.Label className="sr-only">Change published status</Listbox.Label>
                                <div className="relative">
                                    <Listbox.Button className={clsx(changeOrderStatusMutation.isLoading && "cursor-wait")}>
                                        <div className="inline-flex shadow-sm rounded-md divide-x divide-primary">
                                            <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-primary">
                                                <div className="relative inline-flex items-center bg-primary py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-primary-content">
                                                    <FiCheck className="h-5 w-5" aria-hidden="true" />
                                                    <p className="ml-2.5 text-sm font-medium">{selected?.title}</p>
                                                </div>
                                                <div className="relative inline-flex items-center bg-primary p-2 rounded-l-none rounded-r-md text-sm font-medium hover:bg-primary">
                                                    <span className="sr-only">Change published status</span>
                                                    <FiChevronDown className="h-5 w-5 text-primary-content" aria-hidden="true" />
                                                </div>
                                            </div>
                                        </div>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-base-100 divide-y divide-gray-500 border border-primary">
                                            {orderStatusOptions.map((option) => (
                                                <Listbox.Option
                                                    key={option.title}
                                                    className={({ active }) =>
                                                        clsx(
                                                            active ? 'text-primary-content bg-primary' : 'text-base-content',
                                                            'cursor-pointer select-none relative p-4 text-sm'
                                                        )
                                                    }
                                                    value={option}
                                                >
                                                    {({ selected, active }) => (
                                                        <div className="flex flex-col">
                                                            <div className="flex justify-between">
                                                                <p className={selected ? 'font-semibold' : 'font-normal'}>{option.title}</p>
                                                                {selected ? (
                                                                    <span className={active ? '' : 'text-primary'}>
                                                                        <FiCheck className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                            {
                                                                option.description &&
                                                                <p className={clsx(active ? '' : '', 'mt-2')}>
                                                                    {option.description}
                                                                </p>
                                                            }
                                                        </div>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                <div className="border-t border-gray-500 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium">Artworks</dt>
                            <dd className="grid mt-2 gap-2">
                                {
                                    order.data.OrderedArtworks.map(orderedArtwork => (
                                        <Link href={`/artworks/${hashId.encode(orderedArtwork.artworkId)}`} key={orderedArtwork.artworkId}>
                                            <div className="flex items-center space-x-3 hover:opacity-80" >
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
                                                    <div className="font-medium">
                                                        {orderedArtwork.Artwork.name}
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-right font-semibold sm:pr-8">
                                                    {orderedArtwork.currency == Currency.USD && `$${orderedArtwork.price.toLocaleString()}`}
                                                    {orderedArtwork.currency == Currency.ETB && `${orderedArtwork.price.toLocaleString()} ${orderedArtwork.currency}`}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium">Ordered by</dt>
                            <dd className="mt-2">
                                <div className="flex items-center space-x-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <Image
                                                src={order.data.OrderedBy.image ?? ""}
                                                alt="User image"
                                                width={90}
                                                height={90}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {order.data.OrderedBy.name}
                                        </div>
                                        <div className="text-sm opacity-70">{order.data.phoneNumber}</div>
                                    </div>
                                </div>
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium">Paid with</dt>
                            <dd className="mt-1">{prettifyCamel(order.data.paymentMethod)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium">Total Price</dt>
                            <dd className="mt-1 font-bold">
                                {order.data.currency == Currency.USD && `$${order.data.totalPrice.toLocaleString()}`}
                                {order.data.currency == Currency.ETB && `${order.data.totalPrice.toLocaleString()} ${order.data.currency}`}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium">Ordered At</dt>
                            <dd className="mt-1">
                                {order.data.orderedAt.toString()}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium">Status</dt>
                            <dd className="mt-1">
                                {prettifyCamel(order.data.orderStatus)}
                            </dd>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <dt className="text-sm font-medium">Payment Screenshot</dt>
                            <dd className="mt-1 text-sm">
                                <ul role="list" className="border border-gray-400 rounded-md divide-y divide-gray-400">
                                    {
                                        order.data.Screenshot &&
                                        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                <FiPaperclip className="flex-shrink-0 h-5 w-5 text-gray-500" aria-hidden="true" />
                                                <span className="ml-2 flex-1 w-0 truncate">{order.data.Screenshot.fileUrl}</span>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <Link href={resolveUploadResource(order.data.Screenshot.fileUrl)}
                                                    target="_blank"
                                                    className="font-medium text-primary">
                                                    View
                                                </Link>
                                            </div>
                                        </li>
                                    }
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        }
    </>
}

export default ManageOrder;