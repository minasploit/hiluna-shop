import { Currency } from "@prisma/client";
import toast from "react-hot-toast";
import { FiLock, FiUserCheck, FiX } from "react-icons/fi"
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";
import Image from "next/image";
import { type Dispatch, Fragment, type SetStateAction, useCallback, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getArtworkImageUrl } from "~/utils/functions";
import { Transition, Dialog } from "@headlessui/react";
import { hashId } from "~/utils/hashId";

export interface CartItem {
	id: number;
}

const Cart = ({ cartOpen, setCartOpen }: { cartOpen: boolean, setCartOpen: Dispatch<SetStateAction<boolean>> }) => {

	const [hasMounted, setHasMounted] = useState(false);

	const { status } = useSession()
	const router = useRouter();

	const [subTotal, setSubTotal] = useState(0);

	const [cartItemIds, setCartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);
	const cartItems = api.artwork.getMany.useQuery(cartItemIds.map(c => c.id), {
		enabled: cartItemIds.length > 0
	});

	const removeFromCart = useCallback((id: number) => {
		setCartItemIds(cartItemIds.filter(c => c.id != id));
	}, [cartItemIds, setCartItemIds]);

	useEffect(() => {
		if (!cartItems.isFetched)
			return;

		if (cartItems.data?.length != cartItemIds.length) {
			// problematic artwork in cart, remove all items in cart

			setCartItemIds([]);
		}
	});

	useEffect(() => {
		setSubTotal(
			cartItems.data?.map(c => c.price).length ? cartItems.data?.map(c => c.price).reduce((a, b) => a + b) : 0
		)
	}, [cartItems, subTotal]);

	useEffect(() => {
		//remove unavailableforsale artworks from cart
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

	useEffect(() => {
		setHasMounted(true)
	}, []);

	if (!hasMounted)
		return null

	return (
		<>
			<Transition.Root show={cartOpen} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 overflow-hidden z-20" onClose={setCartOpen}>
					<div className="absolute inset-0 overflow-hidden">
						<Transition.Child
							as={Fragment}
							enter="ease-in-out duration-500"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in-out duration-500"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
						</Transition.Child>

						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<div className="pointer-events-auto w-screen max-w-md">
									<div className="flex h-full flex-col overflow-y-scroll bg-base-100 shadow-xl">
										<div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-primary"> Shopping cart </Dialog.Title>
												<div className="ml-3 flex h-7 items-center">
													<button
														type="button"
														className="-m-2 p-2 text-gray-400 hover:text-gray-500"
														onClick={() => setCartOpen(false)}
													>
														<span className="sr-only">Close panel</span>
														<FiX className="h-6 w-6" aria-hidden="true" />
													</button>
												</div>
											</div>

											<div className="mt-8">
												<div className="flow-root">
													<ul role="list" className="-my-6 divide-y divide-gray-500">
														{
															cartItems.data?.length == 0 &&
															<div className="flex justify-between items-center p-4">
																<h2 className="text-lg font-medium">
																	No items in your cart
																</h2>
																<Link href="/artworks" className="btn btn-link" onClick={() => setCartOpen(false)}>
																	Browse Artworks
																</Link>
															</div>
														}
														{cartItems.data?.map((item) => (
															<li key={item.id} className="flex py-6">
																<div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-500">
																	<Image
																		src={getArtworkImageUrl(item)}
																		alt={item.description}
																		width={180} height={180}
																		className="h-full w-full object-cover object-center"
																	/>
																</div>

																<div className="ml-4 flex flex-1 flex-col">
																	<div>
																		<div className="flex justify-between text-base font-medium">
																			<h3>
																				<Link href={`/artworks/${hashId.encode(item.id)}`} onClick={() => setCartOpen(false)}>
																					{item.name}
																				</Link>
																			</h3>
																			<p className="ml-4">
																				{item.currency == Currency.USD && `$${item.price.toLocaleString()}`}
																				{item.currency == Currency.ETB && `${item.price.toLocaleString()} ${item.currency}`}
																			</p>
																		</div>
																		<div className="mt-1 text-sm opacity-80">
																			{item.Collection ? (
																				<p className="">{item.Collection.name}</p>
																			) : null}
																		</div>
																	</div>
																	<div className="flex flex-1 items-end justify-between text-sm">
																		<div className="opacity-80">
																			<p className="">{item.orientation}</p>
																		</div>

																		<div className="flex">
																			<button type="button" className="font-medium text-primary"
																				onClick={() => { removeFromCart(item.id); toast.success("Removed from cart"); }}>
																				Remove
																			</button>
																		</div>
																	</div>
																</div>
															</li>
														))}
													</ul>
												</div>
											</div>
										</div>

										{
											cartItems.data?.length != 0 &&
											<div className="border-t border-gray-500 py-6 px-4 sm:px-6">
												<div className="flex justify-between text-base font-medium">
													<p>Subtotal</p>
													<p>{subTotal.toLocaleString()} ETB</p>
												</div>
												<p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
												<div className="mt-6">
													{
														status == "authenticated"
															?
															<button className="btn btn-primary w-full" onClick={() => {
																void router.push("/checkout");
																setCartOpen(false);
															}}>
																<FiLock className="mx-3 text-xl" />
																Checkout
															</button>
															:
															<button className="btn btn-primary w-full" onClick={() => void signIn("google")}>
																<FiUserCheck className="mx-3 text-xl" />
																Login to checkout
															</button>
													}
												</div>
												<div className="mt-6 flex justify-center text-center text-sm text-gray-500">
													<div>
														{' '} or {' '}
														<button
															type="button"
															className="font-medium text-primary"
															onClick={() => setCartOpen(false)}
														>
															Continue Shopping<span aria-hidden="true"> &rarr;</span>
														</button>
													</div>
												</div>
											</div>
										}
									</div>
								</div>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	)
}

export default Cart