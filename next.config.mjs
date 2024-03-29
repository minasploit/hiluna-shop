// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));
const analyze = await import('@next/bundle-analyzer')

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,

	/**
	 * If you have the "experimental: { appDir: true }" setting enabled, then you
	 * must comment the below `i18n` config out.
	 *
	 * @see https://github.com/vercel/next.js/issues/41980
	 */
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.googleusercontent.com",
				pathname: "/**",
				port: ""
			},
			{
				protocol: "https",
				hostname: "*.fineartamerica.com",
				pathname: "/**",
				port: ""
			},
			{
				protocol: "https",
				hostname: "*.googleapis.com",
				pathname: "/**",
				port: ""
			},
			{
				protocol: "https",
				hostname: "*.hiluna.art",
				pathname: "/**",
				port: ""
			},
			{
				protocol: "https",
				hostname: "tailwindui.com",
				pathname: "/**",
				port: ""
			}
		]
	}
};
const withBundleAnalyzer = analyze.default({
	enabled: process.env.ANALYZE === 'true'
})
export default withBundleAnalyzer({
	...config
})
// export default config;
