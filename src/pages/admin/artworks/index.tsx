import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { type NextPageWithLayout } from "~/pages/_app";

const ManageArtworks: NextPageWithLayout = () => {

    const session = useSession();

    return <>
        <Head>
            <title>Manage Artworks - Hiluna Art</title>
        </Head>

        <div className="flex flex-col lg:flex-row justify-between items-center p-8">
            <div className="">
                <h1 className="text-5xl font-bold">Artworks</h1>
                <p className="py-6">Here are your artworks</p>
            </div>
            <Link href="artworks/new">
                <button className="btn btn-outline">Add new artwork</button>
            </Link>
        </div>

        <div className="overflow-x-auto w-full">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    <tr>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <img src={session.data?.user.image ?? ""} />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Hart Hagerty</div>
                                    <div className="text-sm opacity-50">United States</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Zemlak, Daniel and Leannon
                            <br />
                            <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
                        </td>
                        <td>Purple</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>
                    {/* row 2 */}
                    <tr>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <img src={session.data?.user.image ?? ""} />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Brice Swyre</div>
                                    <div className="text-sm opacity-50">China</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Carroll Group
                            <br />
                            <span className="badge badge-ghost badge-sm">Tax Accountant</span>
                        </td>
                        <td>Red</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>
                    {/* row 3 */}
                    <tr>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <img src={session.data?.user.image ?? ""} />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Marjy Ferencz</div>
                                    <div className="text-sm opacity-50">Russia</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Rowe-Schoen
                            <br />
                            <span className="badge badge-ghost badge-sm">Office Assistant I</span>
                        </td>
                        <td>Crimson</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>
                    {/* row 4 */}
                    <tr>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <img src={session.data?.user.image ?? ""} />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Yancy Tear</div>
                                    <div className="text-sm opacity-50">Brazil</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Wyman-Ledner
                            <br />
                            <span className="badge badge-ghost badge-sm">Community Outreach Specialist</span>
                        </td>
                        <td>Indigo</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>
                </tbody>
                {/* foot */}
                <tfoot>
                    <tr>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                        <th></th>
                    </tr>
                </tfoot>

            </table>
        </div>
    </>
}

export default ManageArtworks