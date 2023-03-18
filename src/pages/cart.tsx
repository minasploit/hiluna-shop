import { Currency } from "@prisma/client";
import toast from "react-hot-toast";
import { FiHelpCircle, FiLock, FiUserCheck, FiX } from "react-icons/fi"
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app"
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { resolveResource } from "~/components/Functions";

export interface CartItem {
    id: number;
}

const Cart: NextPageWithLayout = () => {
    const { status } = useSession()
    const router = useRouter();

    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);

    const [cartItemIds, setCartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);
    const cartItems = api.artwork.getMany.useQuery(cartItemIds.map(c => c.id));

    const removeFromCart = useCallback((id: number) => {
        setCartItemIds(cartItemIds.filter(c => c.id != id));
    }, [cartItemIds, setCartItemIds]);

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
    }, [cartItemIds, cartItems, removeFromCart]);

    return (
        <>
            <div className="max-w-2xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Shopping Cart</h1>
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                    <section aria-labelledby="cart-heading" className="lg:col-span-7">
                        <h2 id="cart-heading" className="sr-only">
                            Items in your shopping cart
                        </h2>

                        <ul role="list" className="border-t border-b border-gray-500 divide-y divide-gray-500">
                            {cartItems.data?.map(item => (
                                <li key={item.id} className="flex py-6 sm:py-10">
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={resolveResource(item.imageUrl)}
                                            alt={item.description}
                                            width={180} height={180}
                                            className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                                        />
                                    </div>

                                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg">
                                                        <a href={`/artworks/${item.id}`} className="font-medium">
                                                            {item.name}
                                                        </a>
                                                    </h3>
                                                </div>
                                                {/* <div className="mt-1 flex text-sm">
                                                    <p className="">{item.color}</p>
                                                    {item.size ? (
                                                        <p className="ml-4 pl-4 border-l border-gray-200">{item.size}</p>
                                                    ) : null}
                                                </div> */}
                                                <p className="mt-1 text-sm font-medium">
                                                    {item.currency == Currency.USD && `$${item.price.toLocaleString()}`}
                                                    {item.currency == Currency.ETB && `${item.price.toLocaleString()} ${item.currency}`}
                                                </p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <div className="absolute top-0 right-0">
                                                    <button type="button" className="-m-2 btn btn-circle btn-outline inline-flex" onClick={() => { removeFromCart(item.id); toast.success("Removed from cart"); }}>
                                                        <span className="sr-only">Remove</span>
                                                        <FiX className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="mt-4 flex text-sm space-x-2">
                                            hi

                                            {/* <span>{item.inStock ? 'In stock' : `Ships in ${item.leadTime ?? ""}`}</span> */}
                                        </p>
                                    </div>
                                </li>
                            ))}
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
                        </ul>
                    </section>

                    {/* Order summary */}
                    {
                        cartItems.data?.length != 0 &&
                        <section
                            aria-labelledby="summary-heading"
                            className="mt-16 bg-base-200 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                        >
                            <h2 id="summary-heading" className="text-lg font-medium">
                                Order summary
                            </h2>

                            <dl className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm">Subtotal</dt>
                                    <dd className="text-sm font-medium">
                                        {subTotal.toLocaleString()} ETB
                                    </dd>
                                </div>
                                <div className="border-t border-gray-500 pt-4 flex items-center justify-between">
                                    <dt className="flex items-center text-sm">
                                        <span>Shipping</span>
                                        <div className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500 tooltip tooltip-right cursor-pointer"
                                            data-tip="Your items will be shipped to you for free">
                                            <span className="sr-only">Learn more about how shipping is calculated</span>
                                            <FiHelpCircle className="h-5 w-5 text-info-content" aria-hidden="true" />
                                        </div>
                                    </dt>
                                    <dd className="text-sm font-medium">Free (0 ETB)</dd>
                                </div>
                                <div className="border-t border-gray-500 pt-4 flex items-center justify-between">
                                    <dt className="text-base font-medium">Order total</dt>
                                    <dd className="text-base font-medium">{total.toLocaleString()} ETB</dd>
                                </div>
                            </dl>

                            <div className="mt-6">
                                {
                                    status == "authenticated"
                                        ?
                                        <button className="btn btn-primary w-full" onClick={() => router.push("/checkout")}>
                                            <FiLock className="mx-3 text-xl" />
                                            Checkout
                                        </button>
                                        :
                                        <button className="btn btn-primary w-full" onClick={() => void signIn()}>
                                            <FiUserCheck className="mx-3 text-xl" />
                                            Login to checkout
                                        </button>
                                }
                            </div>
                        </section>
                    }
                </div>
            </div>
        </>
    )
}

export default Cart