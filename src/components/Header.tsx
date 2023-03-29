import { UserRole } from "@prisma/client";
import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import { useTop } from "~/hooks/useTop";
import SwitchTheme from "./SwitchTheme"
import { Fragment } from "react";
import { useRouter } from "next/router";
import HeaderCartButton from "./HeaderCartButton";
import { FiDollarSign, FiEye, FiHeart, FiImage, FiList, FiLogOut, FiUser } from "react-icons/fi";
import Lotie from "./Lotie";

const nav = [
    { id: 0, title: "Manage Site", icon: <FiEye className="text-xl" />, href: "/admin", adminOnly: true },
    { id: 1, title: "Artworks", icon: <FiImage className="text-xl" />, href: "/artworks", adminOnly: false },
    { id: 2, title: "Collections", icon: <FiList className="text-xl" />, href: "/collections", adminOnly: false },
    // {
    //     id: 3, title: "Item 3", href: "item3",
    //     children: [
    //         { id: 1, title: "Item 1", href: "item1" },
    //         { id: 2, title: "Item 2", href: "item2" }
    //     ]
    // },
]

const Header = () => {

    const router = useRouter();
    const { data: session } = useSession();
    const top = useTop();

    return <>
        <div className={clsx("navbar fixed z-20 backdrop-blur-lg", !top && `shadow`)}>
            <div className="flex-1">
                <div className="navbar-start block md:hidden">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content bg-base-100 mt-3 p-2 shadow rounded-box w-52">
                            <li key="switchTheme"><SwitchTheme /></li>

                            {nav.map(item => {
                                if (item.adminOnly && session?.user.role != UserRole.ADMIN)
                                    return <Fragment key={item.id}></Fragment>

                                return <li key={item.id}>
                                    <Link href={item.href}>
                                        {item.icon}
                                        {item.title}
                                    </Link>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>

                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    <Lotie src="/lottie/palette.json" className="h-[2.75rem] mr-2" />
                    Hiluna Art
                </Link>

                <ul className="menu menu-horizontal px-1 ml-3 hidden md:flex">
                    {nav.map(item => {
                        if ((item.adminOnly && session?.user.role != UserRole.ADMIN) || item.id == 0)
                            return <Fragment key={item.id}></Fragment>

                        return <li key={item.id}>
                            <Link href={item.href} className={clsx("btn", router.route.startsWith(item.href) ? "bg-primary/20 hover:text-white/80" : "btn-ghost")}>
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
                    })}
                </ul>
            </div>
            <div className="flex-none">
                <div className="hidden sm:block">
                    <Link className="swap swap-rotate btn btn-circle btn-ghost" href="/admin">
                        <FiEye className="w-5 h-5" />
                    </Link>
                </div>

                <div className="hidden sm:block">
                    <SwitchTheme />
                </div>

                <HeaderCartButton />

                {
                    session &&
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar ml-3">
                            <div className="w-10 rounded-full">
                                <Image src={session.user.image ?? ""} alt={"user image"} width={40} height={40} />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            {/* <li>
                                <button className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </button>
                            </li> */}
                            <li><button onClick={() => router.push("/profile")}>
                                <FiUser className="text-lg" /> Profile</button>
                            </li>
                            <li><button onClick={() => router.push("/orders")}>
                                <FiDollarSign className="text-lg" /> Orders</button>
                            </li>
                            <li><button onClick={() => router.push("/favorites")}>
                                <FiHeart className="text-lg" /> Favorites</button>
                            </li>
                            <li><button onClick={() => void signOut({ redirect: false })}>
                                <FiLogOut className="text-lg" />
                                Logout
                            </button></li>
                        </ul>
                    </div>
                }
                {
                    !session &&
                    <button className="btn btn-ghost" onClick={() => void signIn()}>Login</button>
                }

            </div>
        </div>
    </>
}

export default Header