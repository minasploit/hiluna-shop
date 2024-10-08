// const footerNavigation = {
//     shop: [
//         { name: 'Bags', href: '#' },
//         { name: 'Tees', href: '#' },
//         { name: 'Objects', href: '#' },
//         { name: 'Home Goods', href: '#' },
//         { name: 'Accessories', href: '#' },
//     ],
//     company: [
//         { name: 'Who we are', href: '#' },
//         { name: 'Sustainability', href: '#' },
//         { name: 'Press', href: '#' },
//         { name: 'Careers', href: '#' },
//         { name: 'Terms & Conditions', href: '#' },
//         { name: 'Privacy', href: '#' },
//     ],
//     account: [
//         { name: 'Manage Account', href: '#' },
//         { name: 'Returns & Exchanges', href: '#' },
//         { name: 'Redeem a Gift Card', href: '#' },
//     ],
//     connect: [
//         { name: 'Contact Us', href: '#' },
//         { name: 'Twitter', href: '#' },
//         { name: 'Instagram', href: '#' },
//         { name: 'Pinterest', href: '#' },
//     ],
// }

const Footer = () => {
	return (
		<footer aria-labelledby="footer-heading" className="">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* <div className="py-20 xl:grid xl:grid-cols-3 xl:gap-8 border-b border-gray-500">
                <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                    <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                        <div>
                            <h3 className="text-sm font-medium">Shop</h3>
                            <ul role="list" className="mt-6 space-y-6">
                                {footerNavigation.shop.map((item) => (
                                    <li key={item.name} className="text-sm">
                                        <a href={item.href} className="">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Company</h3>
                            <ul role="list" className="mt-6 space-y-6">
                                {footerNavigation.company.map((item) => (
                                    <li key={item.name} className="text-sm">
                                        <a href={item.href} className="">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                        <div>
                            <h3 className="text-sm font-mediu">Account</h3>
                            <ul role="list" className="mt-6 space-y-6">
                                {footerNavigation.account.map((item) => (
                                    <li key={item.name} className="text-sm">
                                        <a href={item.href} className="">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Connect</h3>
                            <ul role="list" className="mt-6 space-y-6">
                                {footerNavigation.connect.map((item) => (
                                    <li key={item.name} className="text-sm">
                                        <a href={item.href} className="">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-16 md:mt-16 xl:mt-0">
                    <h3 className="text-sm font-medium">Sign up for our newsletter</h3>
                    <p className="mt-6 text-sm">The latest deals and savings, sent to your inbox weekly.</p>
                    <form className="mt-2 flex sm:max-w-md">
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            type="text"
                            autoComplete="email"
                            required
                            className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-primary placeholder-gray-500"
                        />
                        <div className="ml-4 flex-shrink-0">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div> */}

				<div className="py-10">
					<p className="text-sm">
						Copyright &copy; {`${new Date().getFullYear()}`} Hiluna
						Art
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
