import { type NextPageWithLayout } from "./_app";
import Artwall from "~/components/Artwall";
import Image from "next/image";
import {
	getArtworkImage,
	getArtworkImageUrl,
	resolveStaticResource,
	resolveUploadResource,
} from "~/utils/functions";
import { api } from "~/utils/api";
import { Currency } from "@prisma/client";
import Link from "next/link";
import { hashId } from "~/utils/hashId";
import { useRouter } from "next/router";
import { Fragment } from "react";

const testimonials = [
	{
		id: 1,
		quote: "My order arrived super quickly. The flower pot was on point!! Very happy customer over here.",
		attribution: "Helem Girma, Ethiopia",
	},
	{
		id: 2,
		quote: "Ordered a sculpture of a portrait, what an amazing piece I got!",
		attribution: "Meleket Abel, Ethiopia",
	},
	{
		id: 3,
		quote: "Had a custom design in mind. I got what I had in mind and better. I highly recommend! What a talented individual",
		attribution: "Betel Tium, Ethiopia",
	},
];

const Home: NextPageWithLayout = () => {
	const router = useRouter();

	const favorites = api.artwork.getFavorites.useQuery();
	const featuredMedium = api.medium.listFeatured.useQuery();

	return (
		<>
			<Artwall
				featuredMedium={
					featuredMedium.data?.map((f) => ({
						id: f.id,
						name: f.name,
						href: `/artworks?m=${hashId.encode(f.id)}`,
					})) ?? []
				}
			/>

			<main className="mt-16 flex flex-col gap-16">
				{featuredMedium.data?.length == 3 && (
					<div className="mx-auto max-w-7xl px-4 sm:py-12 sm:px-6 lg:px-8">
						<div className="sm:flex sm:items-baseline sm:justify-between">
							<h2 className="text-2xl font-extrabold tracking-tight">
								Shop by Media
							</h2>
							<Link
								href="/artworks"
								className="hidden text-sm font-semibold text-primary sm:block"
							>
								Browse all medium
								<span aria-hidden="true"> &rarr;</span>
							</Link>
						</div>

						<div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
							{featuredMedium.data?.map((media, mediaIdx) => (
								<Fragment key={`favmedium-${media.id}`}>
									{mediaIdx == 0 && (
										<div className="aspect-w-2 aspect-h-1 sm:aspect-h-1 sm:aspect-w-1 group overflow-hidden rounded-lg sm:relative sm:row-span-2">
											<Image
												width={400}
												height={400}
												priority
												className="w-auto object-cover object-center group-hover:opacity-75"
												src={resolveUploadResource(
													media.FeatureImage?.fileUrl,
												)}
												alt={media.name}
											/>
											<div
												aria-hidden="true"
												className="bg-gradient-to-b from-transparent to-black opacity-50"
											/>
											<div className="flex items-end p-6">
												<div>
													<h3 className="text-xl font-semibold md:text-2xl">
														<Link
															href={`/artworks?m=${hashId.encode(
																media.id,
															)}`}
														>
															<span className="absolute inset-0" />
															{media.name}
														</Link>
													</h3>
													<p
														aria-hidden="true"
														className="mt-1 text-sm"
													>
														Shop now
													</p>
												</div>
											</div>
										</div>
									)}
									{mediaIdx != 0 && (
										<div className="aspect-w-2 aspect-h-1 sm:aspect-none group overflow-hidden rounded-lg sm:relative sm:h-full">
											<Image
												width={500}
												height={500}
												priority
												className="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
												src={resolveUploadResource(
													media.FeatureImage?.fileUrl,
												)}
												alt={media.name}
											/>
											<div
												aria-hidden="true"
												className="bg-gradient-to-b from-transparent to-black opacity-80 sm:absolute sm:inset-0"
											/>
											<div className="flex items-end p-6 sm:absolute sm:inset-0">
												<div>
													<h3 className="text-xl font-semibold sm:text-white md:text-2xl">
														<Link
															href={`/artworks?m=${hashId.encode(
																media.id,
															)}`}
														>
															<span className="absolute inset-0" />
															{media.name}
														</Link>
													</h3>
													<p
														aria-hidden="true"
														className="mt-1 text-sm sm:text-white"
													>
														Shop now
													</p>
												</div>
											</div>
										</div>
									)}
								</Fragment>
							))}
						</div>

						<div className="mt-6 sm:hidden">
							<a
								href="#"
								className="block text-sm font-semibold text-primary"
							>
								Browse all categories
								<span aria-hidden="true"> &rarr;</span>
							</a>
						</div>
					</div>
				)}

				{/* Featured section */}
				{/* <section aria-labelledby="cause-heading">
					<div className="relative bg-secondary py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
						<div className="absolute inset-0 overflow-hidden">
							<img
								src="https://tailwindui.com/img/ecommerce-images/home-page-03-feature-section-full-width.jpg"
								alt=""
								className="w-full h-full object-center object-cover opacity-10"
							/>
						</div>
						<div aria-hidden="true" className="absolute inset-0 bg-gray-900 bg-opacity-50" />
						<div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
							<h2 id="cause-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl text-primary">
								Long-term thinking
							</h2>
							<p className="mt-3 text-xl">
								We're committed to responsible, sustainable, and ethical manufacturing. Our small-scale approach allows
								us to focus on quality and reduce our impact. We're doing our best to delay the inevitable heat-death of
								the universe.
							</p>
							<a
								href="#"
								className="mt-8 w-full btn btn-secondary"
							>
								Read our story
							</a>
						</div>
					</div>
				</section> */}

				<div className="relative mt-8 overflow-hidden">
					{/* Decorative background image and gradient */}
					<div aria-hidden="true" className="absolute inset-0">
						<div className="absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8">
							<Image
								width={700}
								height={700}
								src={resolveStaticResource(
									"home-page-02-sale-full-width.png",
								)}
								alt="Featured artworks"
								className="h-full w-full object-cover object-center"
							/>
						</div>
						<div className="absolute inset-0 bg-base-100 bg-opacity-75" />
						<div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100" />
					</div>

					{/* Sale */}
					<section
						aria-labelledby="sale-heading"
						className="relative mx-auto flex max-w-7xl flex-col items-center py-32 px-4 text-center sm:px-6 lg:px-8"
					>
						<div className="mx-auto max-w-2xl lg:max-w-none">
							<h2
								id="sale-headingssssss"
								className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
							>
								Get to know me and my previous works
							</h2>
							<p className="mx-auto mt-4 max-w-xl text-xl">
								I have participated in various exhibitions and
								competitions and won local and international
								awards.
							</p>
							<button
								className="btn-primary btn mt-6 inline-block w-full rounded-md border border-transparent py-3 px-8 font-medium sm:w-auto"
								onClick={() => router.push("/artworks")}
							>
								View my Artworks
							</button>
						</div>
					</section>

					{/* Testimonials */}
					<section
						aria-labelledby="testimonial-heading"
						className="relative mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:py-32 lg:px-8"
					>
						<div className="mx-auto max-w-2xl lg:max-w-none">
							<h2
								id="testimonial-heading"
								className="text-2xl font-extrabold tracking-tight"
							>
								What are people saying?
							</h2>

							<div className="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
								{testimonials.map((testimonial) => (
									<blockquote
										key={testimonial.id}
										className="sm:flex lg:block"
									>
										<svg
											width={24}
											height={18}
											viewBox="0 0 24 18"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
											className="flex-shrink-0 text-primary-focus"
										>
											<path
												d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z"
												fill="currentColor"
											/>
										</svg>
										<div className="mt-8 sm:mt-0 sm:ml-6 lg:mt-10 lg:ml-0">
											<p className="text-lg opacity-[82]">
												{testimonial.quote}
											</p>
											<cite className="mt-4 block font-semibold not-italic">
												{testimonial.attribution}
											</cite>
										</div>
									</blockquote>
								))}
							</div>
						</div>
					</section>
				</div>

				{/* Favorites section */}
				<section aria-labelledby="favorites-heading">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="sm:flex sm:items-baseline sm:justify-between">
							<h2
								id="favorites-heading"
								className="text-2xl font-extrabold tracking-tight"
							>
								Our Favorites
							</h2>
							{/* <a href="#" className="hidden text-sm font-semibold text-primary sm:block">
								Browse all favorites<span aria-hidden="true"> &rarr;</span>
							</a> */}
						</div>

						<div className="mt-6 columns-1 gap-y-4 sm:columns-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:columns-3">
							{favorites.data?.map((favorite) => (
								<div
									key={favorite.id}
									className="group relative mb-4 overflow-hidden sm:mb-6 md:mb-8"
								>
									<div className="sm:aspect-w-2 sm:aspect-h-3 h-96 w-full overflow-hidden rounded-lg group-hover:opacity-75 sm:h-auto">
										<Image
											src={getArtworkImageUrl(favorite)}
											alt="Favorite artwork image"
											blurDataURL={
												getArtworkImage(favorite).File
													.blurHash ?? undefined
											}
											placeholder={
												getArtworkImage(favorite).File
													.blurHash
													? "blur"
													: "empty"
											}
											className="h-full w-full object-cover object-center"
											width={500}
											height={500}
										/>
									</div>
									<h3 className="mt-4 text-base font-semibold">
										<a
											href={`/artworks/${hashId.encode(
												favorite.id,
											)}`}
										>
											<span className="absolute inset-0" />
											{favorite.name}
										</a>
									</h3>
									<p className="mt-1 text-sm opacity-80">
										{favorite.availableForSale ? (
											<>
												{favorite.currency ==
													Currency.USD &&
													`$${favorite.price.toLocaleString()}`}
												{favorite.currency ==
													Currency.ETB &&
													`${favorite.price.toLocaleString()} ${
														favorite.currency
													}`}
											</>
										) : (
											<span className="mt-1 inline text-sm">
												Not available for sale
											</span>
										)}
									</p>
								</div>
							))}
						</div>

						<div className="mt-6 sm:hidden">
							<a
								href="#"
								className="block text-sm font-semibold text-primary"
							>
								Browse all favorites
								<span aria-hidden="true"> &rarr;</span>
							</a>
						</div>
					</div>
				</section>

				{/* CTA section */}
				<section aria-labelledby="sale-heading">
					<div className="overflow-hidden pt-32 sm:pt-14">
						<div className="bg-primary">
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<div className="relative pt-48 pb-16 sm:pb-24">
									<div>
										<h2
											id="stock-headingsssssssssss"
											className="text-4xl font-extrabold tracking-tight text-primary-content md:text-5xl"
										>
											Beautiful Pots.
											<br />
											Hand made.
										</h2>
										<div className="mt-6 text-base">
											<Link
												href="/artworks?m=O1RNJ"
												className="font-semibold text-primary-content"
											>
												View all pots
												<span aria-hidden="true">
													{" "}
													&rarr;
												</span>
											</Link>
										</div>
									</div>

									<div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
										<div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
											<div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
												<div className="flex-shrink-0">
													<Image
														className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
														// src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
														src={resolveStaticResource(
															"28.jpg",
														)}
														alt="Footer artwork image"
														width={300}
														height={300}
													/>
												</div>

												<div className="mt-6 flex-shrink-0 sm:mt-0">
													<Image
														className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
														src={resolveStaticResource(
															"37.jpg",
														)}
														alt="Footer artwork image"
														width={300}
														height={300}
													/>
												</div>
											</div>
											<div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
												<div className="flex-shrink-0">
													<Image
														className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
														src={resolveStaticResource(
															"33.jpg",
														)}
														alt="Footer artwork image"
														width={300}
														height={300}
													/>
												</div>

												<div className="mt-6 flex-shrink-0 sm:mt-0">
													<Image
														className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
														src={resolveStaticResource(
															"35.jpg",
														)}
														alt="Footer artwork image"
														width={300}
														height={300}
													/>
												</div>
											</div>
											<div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
												<div className="flex-shrink-0">
													<Image
														className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
														src={resolveStaticResource(
															"45.jpg",
														)}
														alt="Footer artwork image"
														width={300}
														height={300}
													/>
												</div>

												<div className="mt-6 flex-shrink-0 sm:mt-0">
													<Image
														className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
														src={resolveStaticResource(
															"44.jpg",
														)}
														alt="Footer artwork image"
														width={300}
														height={300}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
};

export default Home;
