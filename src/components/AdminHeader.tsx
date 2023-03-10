import clsx from "clsx";
import { type NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArchive, FiArrowLeft, FiHome, FiList, FiPenTool } from "react-icons/fi";
import SwitchTheme from "./SwitchTheme"
import { useRouter } from "next/router";
import Head from "next/head";
import crypto from "crypto"

const nav = [
    { id: 0, title: "Dashboard", icon: <FiHome />, href: "/admin" },
    { id: crypto.randomBytes(16).toString('hex'), title: "Artworks", icon: <FiArchive />, href: "/admin/artworks" },
    { id: crypto.randomBytes(16).toString('hex'), title: "Medium", icon: <FiPenTool />, href: "/admin/medium" },
    { id: crypto.randomBytes(16).toString('hex'), title: "Collections", icon: <FiList />, href: "/admin/collections" },
    // {
    //     id: 4, title: "Item 3", href: "item3",
    //     children: [
    //         { id: 1, title: "Item 1", href: "item1" },
    //         { id: 2, title: "Item 2", href: "item2" }
    //     ]
    // },
]

const AdminHeader: NextPage = () => {

    const router = useRouter();

    const { data: session } = useSession();
    const [top, setTop] = useState(true);

    useEffect(() => {
        const scrollHandler = () => {
            window.pageYOffset > 20 ? setTop(false) : setTop(true)
        };
        window.addEventListener('scroll', scrollHandler);

        return () => window.removeEventListener('scroll', scrollHandler);
    }, [top]);

    return <>
        <Head>
            <title>Manage - Hiluna Art</title>
        </Head>

        <div className={clsx("navbar fixed z-10 backdrop-blur-lg border-t-8 border-primary", !top && `shadow`)}>
            <div className="flex-1 justify-between">
                <div className="block md:hidden">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content bg-base-100 mt-3 p-2 shadow rounded-box w-52">
                            <li><SwitchTheme /></li>
                            {nav.map(item => (
                                <li key={item.id}>
                                    <Link href={item.href}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Link href="/" className="btn btn-outline normal-case text-xl gap-2">
                    <FiArrowLeft />
                    Back to Hiluna Art
                </Link>

                <ul className="menu menu-horizontal px-1 ml-3 hidden md:flex">
                    {nav.map(item => (
                        <li key={item.id}>
                            <Link href={item.href} className={clsx("btn",
                                (item.id == 0 && router.route == item.href) || (item.id != 0 && router.route.startsWith(item.href))
                                    ? "bg-primary/20 hover:text-white/80" : "btn-ghost")}>
                                {item.icon}
                                {item.title}
                                {/* {item.children &&
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                                } */}
                            </Link>
                            {/* {item.children &&
                                <ul className="p-2 shadow-lg bg-base-100">
                                    {item.children?.map(child => (
                                        <li key={child.id}><Link href={child.href}>{child.title}</Link></li>
                                    ))}
                                </ul>
                            } */}
                        </li>
                    ))}
                </ul>

                <div className="hidden md:block md:flex-1"></div>

                <div className="flex">
                    <div className="hidden sm:block">
                        <SwitchTheme />
                    </div>

                    {
                        session &&
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar ml-3">
                                <div className="w-10 rounded-full">
                                    <Image src={session.user.image ?? ""} alt={"user image"} width={40} height={40} />
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a>Settings</a></li>
                                <li><a onClick={() => void signOut({ redirect: false })}>Logout</a></li>
                            </ul>
                        </div>
                    }
                    {
                        !session &&
                        <button className="btn btn-ghost" onClick={() => void signIn()}>Login</button>
                    }
                </div>
            </div>
        </div>
    </>
}

export default AdminHeader