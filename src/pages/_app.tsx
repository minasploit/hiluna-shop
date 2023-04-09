import { type AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type ReactElement, type ReactNode } from "react";
import Head from "next/head";
import { type NextPage } from "next";
import setLayoutDefinitions from "~/components/_setLayoutDefinitions";
import { Toaster } from "react-hot-toast";
import { useTheme } from "~/hooks/useTheme";

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
	Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
	useTheme();

	setLayoutDefinitions();

	const getLayout = Component.getLayout ?? (page => page);

	return (
		<>
			<Head>
				<title>Hiluna Art</title>
				<meta name="description" content="Beautiful and Mesmerizing artworks and sculptures hand-made by an experienced artist, presented on Hiluna Art. Visit Hiluna Art to enjoy and shop Hiluna Art's artworks." />
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#7BA8D4" />
			</Head>

			<Toaster />

			<SessionProvider session={session}>
				{getLayout(<Component {...pageProps} />)}
			</SessionProvider>
		</>
	);
};

export default api.withTRPC(MyApp);
