import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const ManageArtworks: NextPageWithLayout = () => {

    const artworks = api.artwork.list.useQuery();

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
                    {
                        artworks.data?.map(artwork => (
                            <tr key={artwork.id}>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <Image
                                                    src={artwork.imageUrl}
                                                    alt="Artwork image"
                                                    width={36}
                                                    height={36}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{artwork.name}</div>
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
                        ))
                    }
                </tbody>
            </table>
        </div>
    </>
}

export default ManageArtworks