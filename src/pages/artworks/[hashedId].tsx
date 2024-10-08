import clsx from "clsx";
import { type NextPageWithLayout } from "../_app";
import { FiPlayCircle } from "react-icons/fi";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Currency, FileType } from "@prisma/client";
import parse from "html-react-parser";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "react-hot-toast";
import { type CartItem } from "../../components/Cart";
import Image from "next/image";
import { getArtworkImageUrl, resolveUploadResource } from "~/utils/functions";
import Link from "next/link";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { AiFillHeart } from "react-icons/ai";
import Head from "next/head";
import { env } from "process";
import { hashId } from "~/utils/hashId";
import { useState } from "react";

const ArtworkDetail: NextPageWithLayout = () => {
	const router = useRouter();
	const { hashedId } = router.query;

	const [id] = useState<number | undefined>(
		typeof hashedId == "string" ? hashId.decode(hashedId) : -1,
	);

	const { data: session } = useSession();

	const [cartItemIds, setCartItemIds] = useLocalStorage<CartItem[]>(
		"cartitems",
		[],
	);

	const artwork = api.artwork.getOne.useQuery(id ?? 0, { enabled: id != -1 });

	const favoriteMutation = api.favorite.toggleFavorite.useMutation();

	function addToCart() {
		setCartItemIds([
			...cartItemIds,
			{
				id: Number(id),
			},
		]);
		toast.success("Added to cart");
	}

	function removeFromCart() {
		setCartItemIds(cartItemIds.filter((c) => c.id != Number(id)));
		toast.success("Removed from cart");
	}

	async function toggleFavorite() {
		await favoriteMutation.mutateAsync(Number(id));

		await artwork.refetch();

		toast.success(
			artwork.data?.FavoritedBy.filter((f) => f.id == session?.user.id)
				.length == 0
				? "Added to favorites"
				: "Removed from favorites",
		);
	}

	function addArtworkJsonLd() {
		return artwork.data
			? {
					__html: `
            {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": "${artwork.data.name}",
                "image": "${getArtworkImageUrl(artwork.data)}",
                "description": "${artwork.data.shortDescription}",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "${artwork.data.rating}",
                  "reviewCount": "${artwork.data.id + 5}"
                },
                "offers": {
                    "@type": "Offer",
                    "price": ${artwork.data.price.toFixed(2)},
                    "priceCurrency": "ETB",
                    "url": "${`${env.NEXT_PUBLIC_NEXTAUTH_URL ?? ""}artworks/${
						hashedId?.toString() ?? ""
					}`}",
                    "itemCondition": "https://schema.org/NewCondition",
                    "availability": "${
						artwork.data.availableForSale
							? "https://schema.org/InStock"
							: "https://schema.org/SoldOut"
					}"
                },
                "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0",
                        "currency": "ETB"
                    }
                }
            }
      `,
			  }
			: { __html: "" };
	}

	return (
		<>
			{(artwork.isLoading || !artwork.data) && (
				<div className="mt-12 flex items-center justify-center">
					{artwork.isLoading && <LoadingSpinner />}

					{!artwork.data && !artwork.isLoading && (
						<div className="card w-96 border border-red-400 bg-base-100 shadow-xl">
							<div className="card-body">
								<h2 className="card-title">Error</h2>
								<p>The artwork selected doesn&apos;t exist.</p>
								<div className="card-actions mt-2 justify-end">
									<Link href={`/artworks`}>
										<button className="btn-primary btn-sm btn">
											Go back
										</button>
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			{artwork.data && (
				<>
					<Head>
						<title>{`${artwork.data.name} - Hiluna Art`}</title>
						<meta property="og:title" content={artwork.data.name} />
						<meta
							name="description"
							content={artwork.data.shortDescription}
							key="desc"
						/>
						<meta
							property="og:description"
							content={artwork.data.shortDescription}
						/>
						<meta
							property="og:image"
							content={getArtworkImageUrl(artwork.data)}
						/>
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={addArtworkJsonLd()}
							key="product-jsonld"
						/>
					</Head>

					<div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
						<div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
							<Tab.Group
								as="div"
								className="flex flex-col-reverse"
							>
								{/* Image selector */}
								<div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
									<Tab.List className="grid grid-cols-4 gap-6">
										{artwork.data.Files.sort((f) =>
											f.File.fileType == FileType.Image
												? -1
												: 1,
										).map((file) => (
											<Tab
												key={file.File.id}
												className="relative flex h-24 cursor-pointer items-center justify-center rounded-md text-sm font-medium uppercase hover:opacity-75"
											>
												{({ selected }) => (
													<>
														<span className="sr-only">
															Artwork file
														</span>
														<span className="absolute inset-0 flex items-center overflow-hidden rounded-md">
															<div className="relative w-full">
																{file.File
																	.fileType ===
																	FileType.Image && (
																	<Image
																		src={resolveUploadResource(
																			file
																				.File
																				.fileUrl,
																		)}
																		alt="Artwork image"
																		priority={
																			true
																		}
																		width={
																			120
																		}
																		height={
																			120
																		}
																		className="h-full w-full object-cover object-center sm:rounded-lg"
																	/>
																)}
																{file.File
																	.fileType ===
																	FileType.Video && (
																	<video
																		src={resolveUploadResource(
																			file
																				.File
																				.fileUrl,
																		)}
																		className="h-full w-full object-cover object-center sm:rounded-lg"
																	></video>
																)}
															</div>
														</span>
														{file.File.fileType ===
															FileType.Video && (
															<div className="absolute">
																<FiPlayCircle className="h-10 w-10 text-white" />
															</div>
														)}
														<span
															className={clsx(
																selected
																	? "ring-primary"
																	: "ring-transparent",
																"pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2",
															)}
															aria-hidden="true"
														/>
													</>
												)}
											</Tab>
										))}
									</Tab.List>
								</div>

								<Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
									{artwork.data.Files.map((file) => (
										<Tab.Panel key={file.File.id}>
											{file.File.fileType ===
												FileType.Image && (
												<Image
													src={resolveUploadResource(
														file.File.fileUrl,
													)}
													alt="Artwork thumbnail"
													priority
													blurDataURL={
														file.File.blurHash ??
														undefined
													}
													placeholder={
														file.File.blurHash
															? "blur"
															: "empty"
													}
													width={720}
													height={720}
													className="h-full w-full object-cover object-center sm:rounded-lg"
												/>
											)}
											{file.File.fileType ===
												FileType.Video && (
												<video
													controls
													className="h-full w-full object-cover object-center sm:rounded-lg"
												>
													<source
														src={resolveUploadResource(
															file.File.fileUrl,
														)}
														type={
															file.File
																.mimeType ??
															"video/mp4"
														}
													/>
													Your browser does not
													support the video tag.
												</video>
											)}
										</Tab.Panel>
									))}
								</Tab.Panels>
							</Tab.Group>

							<div className="sticky top-[7.2rem] mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
								<div className="flex justify-between">
									<div>
										<span className="text-3xl font-extrabold tracking-tight">
											{artwork.data?.name}
										</span>
										<div className="text-sm">
											{artwork.data?.Collection?.name}
										</div>
									</div>

									<button
										className={clsx(
											"btn gap-2 rounded-full ",
											artwork.data.FavoritedBy.filter(
												(f) => f.id == session?.user.id,
											).length == 0
												? "btn-outline"
												: "btn-primary",
										)}
										onClick={toggleFavorite}
									>
										{favoriteMutation.isLoading ? (
											<LoadingSpinner
												className={clsx(
													"h-5 w-5",
													artwork.data.FavoritedBy.filter(
														(f) =>
															f.id ==
															session?.user.id,
													).length == 0
														? "text-base-100"
														: "text-black",
												)}
											/>
										) : (
											<AiFillHeart className="text-xl" />
										)}

										{artwork.data.FavoritedBy.length +
											artwork.data.id * 3}
									</button>
								</div>

								<div className="mt-3">
									<h2 className="sr-only">
										Product information
									</h2>
									<p className="text-3xl">
										{artwork.data?.availableForSale && (
											<>
												{artwork.data?.currency ==
													Currency.USD &&
													`$${artwork.data?.price.toLocaleString()}`}
												{artwork.data?.currency ==
													Currency.ETB &&
													`${artwork.data?.price.toLocaleString()} ${
														artwork.data?.currency
													}`}
											</>
										)}
									</p>
								</div>

								{/* Reviews */}
								<div className="mt-3">
									<h3 className="sr-only">Reviews</h3>
									<div className="flex items-center">
										<div className="flex items-center">
											<div className="rating rating-half">
												<input
													type="radio"
													name="rating-10"
													className="rating-hidden"
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-1 mask-star-2 bg-primary"
													checked={
														artwork.data.rating ==
														0.5
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-2 mask-star-2 bg-primary"
													checked={
														artwork.data.rating == 1
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-1 mask-star-2 bg-primary"
													checked={
														artwork.data.rating ==
														1.5
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-2 mask-star-2 bg-primary"
													checked={
														artwork.data.rating == 2
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-1 mask-star-2 bg-primary"
													checked={
														artwork.data.rating ==
														2.5
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-2 mask-star-2 bg-primary"
													checked={
														artwork.data.rating == 3
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-1 mask-star-2 bg-primary"
													checked={
														artwork.data.rating ==
														3.5
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-2 mask-star-2 bg-primary"
													checked={
														artwork.data.rating == 4
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-1 mask-star-2 bg-primary"
													checked={
														artwork.data.rating ==
														4.5
													}
													readOnly
												/>
												<input
													type="radio"
													name="rating-10"
													className="mask mask-half-2 mask-star-2 bg-primary"
													checked={
														artwork.data.rating == 5
													}
													readOnly
												/>
											</div>
										</div>
										<p className="sr-only">
											{artwork.data.rating.toString()} out
											of 5 stars
										</p>
									</div>
								</div>

								<div className="my-3">
									{artwork.data.Medium.map((m) => (
										<span
											className="badge-primary badge badge-lg mx-1"
											key={m.id}
										>
											{m.name}
										</span>
									))}
								</div>

								<div className="">
									<h3 className="sr-only">Description</h3>

									<div className="space-y-6 text-base">
										{parse(artwork.data?.description ?? "")}
									</div>
								</div>

								<dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
									<div className="sm:col-span-1">
										<dt className="text-sm font-medium">
											Dimensions
										</dt>
										<dd className="mt-1 text-sm">
											{artwork.data?.dimension}
										</dd>
									</div>
									<div className="sm:col-span-1">
										<dt className="text-sm font-medium">
											Orientation
										</dt>
										<dd className="mt-1 text-sm">
											{artwork.data?.orientation}
										</dd>
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

								<div className="sm:flex-col1 mt-10 flex">
									{artwork.data?.availableForSale && (
										<>
											{cartItemIds.filter(
												(c) => c.id == Number(id),
											).length == 0 ? (
												<button
													className="btn-primary btn-wide btn"
													onClick={addToCart}
												>
													Add to cart
												</button>
											) : (
												<button
													className="btn-outline btn-error btn-wide btn"
													onClick={removeFromCart}
												>
													Remove from cart
												</button>
											)}
										</>
									)}
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
				</>
			)}
		</>
	);
};

export default ArtworkDetail;
