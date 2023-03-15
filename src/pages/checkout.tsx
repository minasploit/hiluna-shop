import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";
import { type CartItem } from "./cart";
import { type NextPageWithLayout } from "./_app";

import { RadioGroup } from '@headlessui/react'
import { FiCheckSquare, FiTrash } from "react-icons/fi";
import type FieldAttribute from "~/components/form/FieldAttributes";
import crypto from 'crypto'
import { FieldType } from "~/components/form/FieldAttributes";
import { AddOrderFormSchema } from "~/utils/schema";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import Field from "~/components/form/Field";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import React from "react";
import { FtpUploadResult } from "./api/upload";
import { PaymentMethod } from "@prisma/client";
import { useRouter } from "next/router";

const paymentMethods = [
    { id: 0, title: 'Cash on Delivery', label: 'Cash', turnaround: '4–10 business days', price: '$5.00' },
    { id: 1, title: 'CBE', label: 'CBE', turnaround: '2–5 business days', price: '$16.00' },
    { id: 2, title: 'Telebirr', label: 'Telebirr', turnaround: '2–5 business days', price: '$16.00' },
    { id: 3, title: 'Bunna', label: 'Bunna', turnaround: '2–5 business days', price: '$16.00' },
]

// const phoneNumberField: FieldAttribute = {
//     id: crypto.randomBytes(16).toString('hex'),
//     name: "phoneNumber",
//     label: "Your phone number",
//     type: FieldType.TEXT
// }

const Checkout: NextPageWithLayout = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
    const [screenshotFile, setScreenshotFile] = useState<File>();
    const inputFileRef = React.useRef<HTMLInputElement | null>(null);

    const router = useRouter();
    
    const [cartItemIds, setCartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);
    const cartItems = api.artwork.getMany.useQuery(cartItemIds.map(c => c.id));

    const orderMutation = api.order.create.useMutation();

    const checkoutFields: FieldAttribute[] = [
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "phoneNumber",
            label: "Your phone number",
            type: FieldType.TEXT
        },
        {
            id: crypto.randomBytes(16).toString('hex'),
            name: "screenshot",
            label: "Add a screenshot of the transaction",
            inputFileRef: inputFileRef,
            accept: "image/*",
            type: FieldType.FILE,
            multiple: true,
            required: selectedPaymentMethod?.id != 0
        }
    ]

    useEffect(() => {
        setSubTotal(
            cartItems.data?.map(c => c.price).length ? cartItems.data?.map(c => c.price).reduce((a, b) => a + b) : 0
        )
        setTotal(subTotal)
    }, [cartItems, subTotal]);

    useEffect(() => {
        cartItems.data?.forEach(c => {
            if (!c.availableForSale && cartItemIds.map(cc => cc.id).includes(c.id)) {
                // remove from cart
                removeFromCart(c.id);
                toast(`Removed ${c.name} from your cart because it is no longer available for purchase.`, {
                    duration: 5000
                });
            }
        })
    }, [cartItemIds, cartItems]);

    function removeFromCart(id: number) {
        setCartItemIds(cartItemIds.filter(c => c.id != Number(id)));
    }

    const handleSelectedFile = (files: FileList | null) => {
        if (files && files[0] && files[0].size < 10000000) {
            setScreenshotFile(files[0])
        } else {
            toast.error("file size too large");
        }
    }

    type AddOrderFormSchemaType = z.infer<typeof AddOrderFormSchema>;
    const checkoutForm = useForm<AddOrderFormSchemaType>({
        resolver: zodResolver(AddOrderFormSchema),
    });

    const onSubmit: SubmitHandler<AddOrderFormSchemaType> = async (data) => {
        


        // ======================================================================

        const toastId = toast.loading("Placing order...");

        try {
            let url: string | null = null;

            if (selectedPaymentMethod?.id != 0) {

                if (!inputFileRef.current?.files?.length) {
                    toast.error("Please, select the files you want to upload.", { id: toastId });
                    return;
                }
        
                const formData = new FormData();
                Object.values(inputFileRef.current.files).forEach(file => {
                    formData.append('file', file);
                })
        
                /* Send request to our api route */
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
        
                const body = await response.json() as FtpUploadResult;
        
                console.log(body);

                // set the url here
            }

            await orderMutation.mutateAsync({
                items: cartItemIds.map(c => c.id),
                phoneNumber: data.phoneNumber,
                screenshotUrl: url,
                paymentMethod: PaymentMethod.CBE
            });

            // checkoutForm.reset();

            toast.success("Order placed. Thank you!", { id: toastId });

            setCartItemIds([]);

            await router.push("/orders");
        } catch {
            toast.success("Error placing order...", { id: toastId });
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-5">Checkout</h1>

                <h2 className="sr-only">Checkout</h2>

                {
                    cartItems.data?.length == 0 &&
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-lg font-medium">
                            No items in your cart
                        </h2>
                        <Link href="/artworks">
                            <button className="btn btn-link">Browse Artworks</button>
                        </Link>
                    </div>
                }

                {
                    cartItems.data?.length != 0 &&
                    <FormProvider {...checkoutForm}>
                        <form onSubmit={checkoutForm.handleSubmit(onSubmit)} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                            <div>
                                <div>
                                    <h2 className="text-lg font-medium">Contact information</h2>

                                    <div className="mt-4">
                                        {
                                            <Field {...(checkoutFields[0])} />
                                        }
                                    </div>
                                </div>

                                <div className="mt-10 border-t border-gray-500 pt-10">
                                    <RadioGroup value={selectedPaymentMethod} onChange={setSelectedPaymentMethod}>
                                        <RadioGroup.Label className="text-lg font-medium">Payment method</RadioGroup.Label>

                                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                            {paymentMethods.map((paymentMethod) => (
                                                <RadioGroup.Option
                                                    key={paymentMethod.id}
                                                    value={paymentMethod}
                                                    className={({ checked, active }) =>
                                                        clsx(
                                                            checked ? 'border-transparent' : 'border-gray-500',
                                                            active ? 'ring-2 ring-primary' : '',
                                                            'relative bg-base-100 border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                                                        )
                                                    }
                                                >
                                                    {({ checked, active }) => (
                                                        <>
                                                            <div className="flex-1 flex">
                                                                <div className="flex flex-col">
                                                                    <RadioGroup.Label as="span" className="block text-sm font-medium">
                                                                        {paymentMethod.title}
                                                                    </RadioGroup.Label>
                                                                    <RadioGroup.Description
                                                                        as="span"
                                                                        className="mt-1 flex items-center text-sm"
                                                                    >
                                                                        {paymentMethod.turnaround}
                                                                    </RadioGroup.Description>
                                                                    <RadioGroup.Description as="span" className="mt-6 text-sm font-medium">
                                                                        {paymentMethod.price}
                                                                    </RadioGroup.Description>
                                                                </div>
                                                            </div>
                                                            {checked ? <FiCheckSquare className="h-5 w-5 text-primary" aria-hidden="true" /> : null}
                                                            <div
                                                                className={clsx(
                                                                    active ? 'border' : 'border-2',
                                                                    checked ? 'border-primary' : 'border-transparent',
                                                                    'absolute -inset-px rounded-lg pointer-events-none'
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Payment */}
                                <div className="mt-10">
                                    <h2 className="text-lg font-medium">Pay with {selectedPaymentMethod?.label}</h2>

                                    <div className="mt-6">
                                        instructions on how to deposit
                                    </div>

                                    <div className="mt-6">
                                        {
                                            selectedPaymentMethod?.id != 0 &&
                                            <>
                                                {
                                                    <Field {...(checkoutFields[1])} />
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Order summary */}
                            <div className="mt-10 lg:mt-0">
                                <h2 className="text-lg font-medium">Order summary</h2>

                                <div className="mt-4 border border-gray-500 rounded-lg shadow-sm">
                                    <h3 className="sr-only">Items in your cart</h3>
                                    <ul role="list" className="divide-y divide-gray-500">
                                        {cartItems.data?.map((item) => (
                                            <li key={item.id} className="flex py-6 px-4 sm:px-6">
                                                <div className="flex-shrink-0">
                                                    {item.imageUrl &&
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt="Artwork image"
                                                            width={80} height={80}
                                                            className="w-20 rounded-md" />
                                                    }
                                                </div>

                                                <div className="ml-6 flex-1 flex flex-col">
                                                    <div className="flex">
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-sm">
                                                                <a href={`/artworks/${item.id}`} className="font-medium">
                                                                    {item.name}
                                                                </a>
                                                            </h4>
                                                            <p className="mt-1 text-sm">{item.dimension}</p>
                                                            {/* <p className="mt-1 text-sm">{item.}</p> */}
                                                        </div>

                                                        <div className="ml-4 flex-shrink-0 flow-root">
                                                            <button
                                                                type="button"
                                                                onClick={() => { removeFromCart(item.id); toast.success("Removed from cart"); }}
                                                                className="-m-2.5 flex items-center justify-center btn btn-circle">
                                                                <span className="sr-only">Remove</span>
                                                                <FiTrash className="h-5 w-5" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 pt-2 flex items-end justify-between">
                                                        <p className="mt-1 text-sm font-medium">{item.price.toLocaleString()} ETB</p>

                                                        <div className="ml-4">

                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <dl className="border-t border-gray-500 py-6 px-4 space-y-6 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <dt className="text-sm">Subtotal</dt>
                                            <dd className="text-sm font-medium">{subTotal.toLocaleString()} ETB</dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="text-sm">Shipping</dt>
                                            <dd className="text-sm font-medium">Free (0 ETB)</dd>
                                        </div>
                                        {/* <div className="flex items-center justify-between">
                                        <dt className="text-sm">Taxes</dt>
                                        <dd className="text-sm font-medium">$5.52</dd>
                                    </div> */}
                                        <div className="flex items-center justify-between border-t border-gray-500 pt-6">
                                            <dt className="text-base font-medium">Total</dt>
                                            <dd className="text-base font-medium">{total.toLocaleString()} ETB</dd>
                                        </div>
                                    </dl>

                                    <div className="border-t border-gray-500 py-6 px-4 sm:px-6">
                                        <button type="submit" className="w-full btn btn-primary" disabled={cartItems.data?.length == 0}>
                                            Confirm order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                }
            </div>
        </>
    )
}

export default Checkout