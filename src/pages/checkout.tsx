import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";
import { type CartItem } from "./cart";
import { type NextPageWithLayout } from "./_app";
import { RadioGroup } from '@headlessui/react'
import { FiCheckSquare, FiInfo, FiTrash } from "react-icons/fi";
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
import React from "react";
import { type FtpUploadResult } from "./api/upload";
import { PaymentMethod } from "@prisma/client";
import { useRouter } from "next/router";
import { resolveResource } from "~/components/Functions";

const paymentMethods = [
    { id: 0, title: 'Cash on Delivery', label: 'Cash', description: 'Make the payment in cash when the artwork is delivered', value: PaymentMethod.CashOnDelivery },
    { id: 1, title: 'CBE', label: 'CBE', description: 'Make the payment using CBE', value: PaymentMethod.CBE },
    { id: 2, title: 'Telebirr', label: 'Telebirr', description: 'Make the payment using Telebirr', value: PaymentMethod.Telebirr },
    { id: 3, title: 'Bunna Bank', label: 'Bunna', description: 'Make the payment using Bunna', value: PaymentMethod.Bunna },
]

const Checkout: NextPageWithLayout = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
    const inputFileRef = React.useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const [cartItemIds, setCartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);
    const cartItems = api.artwork.getMany.useQuery(cartItemIds.map(c => c.id));

    const orderMutation = api.order.create.useMutation();

    const phoneNumberField: FieldAttribute = {
        id: crypto.randomBytes(16).toString('hex'),
        name: "phoneNumber",
        label: "Your phone number",
        type: FieldType.TEXT
    }

    const screenshotField: FieldAttribute = {
        id: crypto.randomBytes(16).toString('hex'),
        name: "screenshot",
        label: "Provide a screenshot or image of the payment",
        inputFileRef: inputFileRef,
        accept: "image/*",
        type: FieldType.FILE,
        required: selectedPaymentMethod?.id != 0
    }

    useEffect(() => {
        // calculate total and subtotal
        setSubTotal(
            cartItems.data?.map(c => c.price).length ? cartItems.data?.map(c => c.price).reduce((a, b) => a + b) : 0
        )
        setTotal(subTotal)
    }, [cartItems, subTotal]);

    useEffect(() => {
        // check if all items in the cart are available for sale
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

    type AddOrderFormSchemaType = z.infer<typeof AddOrderFormSchema>;
    const checkoutForm = useForm<AddOrderFormSchemaType>({
        resolver: zodResolver(AddOrderFormSchema),
    });

    const onSubmit: SubmitHandler<AddOrderFormSchemaType> = async (data) => {
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

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json() as FtpUploadResult;

                if (result.status == 500 || !result.urls[0]) {
                    toast.error("Error uploading the file", { id: toastId });
                    return;
                }

                // set screenshot url
                url = result.urls[0]?.newName
            }

            await orderMutation.mutateAsync({
                items: cartItemIds.map(c => c.id),
                phoneNumber: data.phoneNumber,
                screenshotUrl: url,
                paymentMethod: selectedPaymentMethod?.value
            });

            checkoutForm.reset();

            toast.success("Order placed. Thank you!", { id: toastId });

            setCartItemIds([]);

            await router.push("/orders");
        } catch {
            toast.error("Error placing order...", { id: toastId });
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
                                            <Field {...phoneNumberField} />
                                        }
                                    </div>
                                </div>

                                <div className="mt-10 border-t border-gray-500 pt-10">
                                    <RadioGroup value={selectedPaymentMethod} onChange={setSelectedPaymentMethod}
                                        disabled={checkoutForm.formState.isSubmitting}>
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
                                                            checkoutForm.formState.isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
                                                            'relative bg-base-100 border rounded-lg shadow-sm p-4 flex focus:outline-none'
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
                                                                    <RadioGroup.Description as="span" className="mt-6 flex items-center text-sm">
                                                                        {paymentMethod.description}
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

                                {
                                    selectedPaymentMethod?.id != 0 &&
                                    <>
                                        {/* Payment */}
                                        <div className="mt-10">
                                            <h2 className="text-lg font-medium">Pay with {selectedPaymentMethod?.label}</h2>

                                            <div className="mt-6 border border-primary p-3 rounded-md">
                                                {
                                                    selectedPaymentMethod?.id == 1 &&
                                                    <>
                                                        {/* cbe */}
                                                        Send a total of <span className="font-bold text-primary">{total.toLocaleString()} ETB</span> to {" "}
                                                        <span className="font-bold text-primary">1000276021129</span>
                                                        <br />
                                                        <br />
                                                        <span>
                                                            <FiInfo className="inline mr-2" />
                                                            Make sure to take screenshot or image of the transfer and provide it below.
                                                        </span>
                                                    </>
                                                }
                                                {
                                                    selectedPaymentMethod?.id == 2 &&
                                                    <>
                                                        {/* telebirr */}
                                                        Send a total of <span className="font-bold text-primary">{total.toLocaleString()} ETB</span> to {" "}
                                                        <span className="font-bold text-primary">0938053405</span>
                                                        <br />
                                                        <br />
                                                        <span>
                                                            <FiInfo className="inline mr-2" />
                                                            Make sure to take screenshot or image of the transfer and provide it below.
                                                        </span>
                                                    </>
                                                }
                                                {
                                                    selectedPaymentMethod?.id == 3 &&
                                                    <>
                                                        {/* telebirr */}
                                                        Send a total of <span className="font-bold text-primary">{total.toLocaleString()} ETB</span> to {" "}
                                                        <span className="font-bold text-primary">1234567890</span>
                                                        <br />
                                                        <br />
                                                        <span>
                                                            <FiInfo className="inline mr-2" />
                                                            Make sure to take screenshot or image of the transfer and provide it below.
                                                        </span>
                                                    </>
                                                }
                                            </div>

                                            <div className="mt-6">
                                                {
                                                    selectedPaymentMethod?.id != 0 &&
                                                    <>
                                                        {
                                                            <Field {...screenshotField} />
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </>
                                }
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
                                                            src={resolveResource(item.imageUrl)}
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
                                        <button type="submit" className="w-full btn btn-primary" disabled={cartItems.data?.length == 0 || checkoutForm.formState.isSubmitting}>
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