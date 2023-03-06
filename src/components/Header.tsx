import { UserRole } from "@prisma/client";
import clsx from "clsx";
import { type NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import { useTop } from "~/hooks/useTop";
import SwitchTheme from "./SwitchTheme"

const nav = [
    { id: 0, title: "Manage Site", href: "admin" },
    { id: 1, title: "Artworks", href: "artworks" },
    { id: 2, title: "Collections", href: "collections" },
    // {
    //     id: 3, title: "Item 3", href: "item3",
    //     children: [
    //         { id: 1, title: "Item 1", href: "item1" },
    //         { id: 2, title: "Item 2", href: "item2" }
    //     ]
    // },
]

const Header: NextPage = () => {

    const { data: session } = useSession();
    const top = useTop()

    return <>
        <div className={clsx("navbar fixed z-10 backdrop-blur-lg", !top && `shadow`)}>
            <div className="flex-1">
                <div className="navbar-start block md:hidden">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content bg-base-100 mt-3 p-2 shadow rounded-box w-52">
                            <li key="switchTheme"><SwitchTheme /></li>
                            {nav.map(item => {
                                if (item.id == 0 && session?.user.role != UserRole.ADMIN)
                                    return <></>

                                return <li key={item.id}>
                                    <Link href={item.href}>{item.title}</Link>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>

                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    Hiluna Art
                </Link>

                <ul className="menu menu-horizontal px-1 ml-3 hidden md:flex">
                    {nav.map(item => {
                        if (item.id == 0 && session?.user.role != UserRole.ADMIN)
                            return <></>

                        return <li key={item.id}>
                            <Link href={item.href}>
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
                    <SwitchTheme />
                </div>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span className="badge badge-sm indicator-item">8</span>
                        </div>
                    </label>
                    <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                        <div className="card-body">
                            <span className="font-bold text-lg">8 Items</span>
                            <span className="text-info">Subtotal: $999</span>
                            <div className="card-actions">
                                <button className="btn btn-primary btn-block">View cart</button>
                            </div>
                        </div>
                    </div>
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
    </>
}

export default Header