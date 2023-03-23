import { type NextPageWithLayout } from "./_app";
import Artwall from "~/components/Artwall";
import Image from "next/image";

const Home: NextPageWithLayout = () => {

	return (
		<>
			<Artwall />

			<main className="flex flex-col items-center justify-center shadow-2xl">
				<div className="container flex flex-col items-center justify-center gap-12 max-w-full">

					{/* <div className="hidden sm:block pt-14 w-full backdrop-blur-md" id="divvvv">
						
					</div> */}

					<div className="hidden sm:block pt-10 w-full">

					</div>

					<div className="">
						<div className="max-w-7xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
							<div className="sm:flex sm:items-baseline sm:justify-between">
								<h2 className="text-2xl font-extrabold tracking-tight">Shop by Category</h2>
								<a href="#" className="hidden text-sm font-semibold text-primary sm:block">
									Browse all categories<span aria-hidden="true"> &rarr;</span>
								</a>
							</div>

							<div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
								<div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
									<Image
										width={500} height={500}
										className="object-center object-cover group-hover:opacity-75"
										src={"https://tailwindui.com/img/ecommerce-images/home-page-03-featured-category.jpg"}
										alt={"Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee"}
									/>
									<div aria-hidden="true" className="bg-gradient-to-b from-transparent to-black opacity-50" />
									<div className="p-6 flex items-end">
										<div>
											<h3 className="font-semibold">
												<a href="#">
													<span className="" />
													New Arrivals
												</a>
											</h3>
											<p aria-hidden="true" className="mt-1 text-sm">
												Shop now
											</p>
										</div>
									</div>
								</div>
								<div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full">
									<Image
										width={500} height={500}
										className="object-center object-cover group-hover:opacity-75 sm:absolute sm:inset-0 sm:w-full sm:h-full"
										src={"https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"}
										alt={"Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters."}
									/>
									<div
										aria-hidden="true"
										className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
									/>
									<div className="p-6 flex items-end sm:absolute sm:inset-0">
										<div>
											<h3 className="font-semibold sm:text-white">
												<a href="#">
													<span className="absolute inset-0" />
													Accessories
												</a>
											</h3>
											<p aria-hidden="true" className="mt-1 text-sm sm:text-white">
												Shop now
											</p>
										</div>
									</div>
								</div>
								<div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full">
									<Image
										width={500} height={500}
										className="object-center object-cover group-hover:opacity-75 sm:absolute sm:inset-0 sm:w-full sm:h-full"
										src={"https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg"}
										alt={"Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk."}
									/>
									<div
										aria-hidden="true"
										className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
									/>
									<div className="p-6 flex items-end sm:absolute sm:inset-0">
										<div>
											<h3 className="font-semibold sm:text-white">
												<a href="#">
													<span className="absolute inset-0" />
													Workspace
												</a>
											</h3>
											<p aria-hidden="true" className="mt-1 text-sm sm:text-white">
												Shop now
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-6 sm:hidden">
								<a href="#" className="block text-sm font-semibold text-primary">
									Browse all categories<span aria-hidden="true"> &rarr;</span>
								</a>
							</div>
						</div>
					</div>

					{/* <div className="">
						<div className="max-w-7xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
							<div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Shop by Category</h2>
								<a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
									Browse all categories<span aria-hidden="true"> &rarr;</span>
								</a>
							</div>

							<div className="mt-4 flow-root">
								<div className="-my-2">
									<div className="box-content py-2 relative h-80 overflow-x-auto xl:overflow-visible">
										<div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
											{categories.map((category) => (
												<a
													key={category.name}
													href={category.href}
													className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
												>
													<span aria-hidden="true" className="absolute inset-0">
														<img src={category.imageSrc} alt="" className="w-full h-full object-center object-cover" />
													</span>
													<span
														aria-hidden="true"
														className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
													/>
													<span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
												</a>
											))}
										</div>
									</div>
								</div>
							</div>

							<div className="mt-6 px-4 sm:hidden">
								<a href="#" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
									Browse all categories<span aria-hidden="true"> &rarr;</span>
								</a>
							</div>
						</div>
					</div> */}

				</div>
			</main>
		</>
	);
};

export default Home;

// const AuthShowcase: React.FC = () => {
// 	const { data: sessionData } = useSession();

// 	const { data: secretMessage } = api.example.getSecretMessage.useQuery(
// 		undefined, // no input
// 		{ enabled: sessionData?.user !== undefined },
// 	);

// 	return (
// 		<div className="flex flex-col items-center justify-center gap-4">
// 			<p className="text-center text-2xl">
// 				{sessionData && <span>Logged in as {sessionData.user?.name}</span>}
// 				{secretMessage && <span> - {secretMessage}</span>}
// 			</p>
// 			<button
// 				className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
// 				onClick={sessionData ? () => void signOut() : () => void signIn()}
// 			>
// 				{sessionData ? "Sign out" : "Sign in"}
// 			</button>
// 		</div>
// 	);
// };
