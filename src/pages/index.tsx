import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";
import Artwall from "~/components/Artwall";

const Home: NextPageWithLayout = () => {
	const mediaMutation = api.medium.create.useMutation()
	const medium = api.medium.list.useQuery();

	function addMedia() {
		mediaMutation.mutate({
			name: "Minasie",
			description: "Dagem"
		});
	}

	return (
		<>
			<Artwall />

			<main className="flex flex-col items-center justify-center">
				<div className="container flex flex-col items-center justify-center gap-12">
					<div className="my-12 grid grid-flow-col grid-cols-3 gap-6">
						<div className="col-span-1">
							{/* <Image
							src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/dancing-queen-balazs-solti.jpg"
							width={50} height={100} alt="portrait images" /> */}
							<img src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/dancing-queen-balazs-solti.jpg"
								alt="" className="h-max rounded-xl" />
						</div>
						<ul>
							{
								medium.data?.map((media) => (
									<li key={media.id}>{media.name}</li>
								))
							}
						</ul>
						<button className="btn btn-primary" onClick={addMedia}>hi</button>
						<div className="col-span-2 grid gap-6 grid-rows-4">
							<p className="row-span-1 flex items-center justify-center text-3xl">Portrait and Landscape</p>
							<div className="row-span-3">
								<img src="https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067__340.png"
									alt="" className="h-max rounded-xl" />
							</div>
						</div>
					</div>
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
