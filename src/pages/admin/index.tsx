import Link from "next/link";
import { FiImage, FiList, FiPenTool, FiUsers } from "react-icons/fi";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";
import Head from "next/head";

const AdminPage: NextPageWithLayout = () => {

    const dashboardNumbers = api.dashboard.getDashboardNumbers.useQuery();

    return <>
        <Head>
            <title>Dashboard - Hiluna Art</title>
        </Head>

        <div className="text-center min-h-screen overflow-x-auto">

            <div className="stats stats-vertical sm:stats-horizontal shadow gap-5 mt-10">
                <div className="stat">
                    <div className="stat-title">Active Orders</div>
                    <div className="stat-value">{dashboardNumbers.data?.activeOrderCount.toLocaleString()}</div>
                    <div className="stat-actions">
                        <Link href={`/admin/orders`}>
                            <button className="btn btn-sm btn-primary">Manage</button>
                        </Link>
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total Revenue</div>
                    <div className="stat-value">{dashboardNumbers.data?.revenue.toLocaleString()} ETB</div>
                    <div className="stat-actions">
                        <Link href={`/admin/orders`}>
                            <button className="btn btn-sm btn-primary">View orders</button>
                        </Link>
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FiUsers className="text-4xl" />
                    </div>
                    <div className="stat-title">Users</div>
                    <div className="stat-value text-primary">{dashboardNumbers.data?.userCount}</div>
                    <div className="stat-desc">Total number of users</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FiImage className="text-4xl" />
                    </div>
                    <div className="stat-title">Artworks</div>
                    <div className="stat-value text-primary">{dashboardNumbers.data?.artworkCount}</div>
                    <div className="stat-desc">Total number of artworks</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FiPenTool className="text-4xl" />
                    </div>
                    <div className="stat-title">Medium</div>
                    <div className="stat-value text-primary">{dashboardNumbers.data?.mediumCount}</div>
                    <div className="stat-desc">Total number of medium</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FiList className="text-4xl" />
                    </div>
                    <div className="stat-title">Collections</div>
                    <div className="stat-value text-primary">{dashboardNumbers.data?.collectionCount}</div>
                    <div className="stat-desc">Total number of collections</div>
                </div>
            </div>
        </div>
    </>
}

export default AdminPage