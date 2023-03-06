import { FiArchive, FiList, FiUsers } from "react-icons/fi";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";

const AdminPage: NextPageWithLayout = () => {

    const dashboardNumbers = api.dashboard.getDashboardNumbers.useQuery();

    return <>
        <div className="flex justify-center items-start min-h-screen">
            <div className="stats stats-vertical sm:stats-horizontal shadow gap-5 mt-10">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FiUsers />
                    </div>
                    <div className="stat-title">Users</div>
                    <div className="stat-value text-primary">{dashboardNumbers.data?.userCount}</div>
                    <div className="stat-desc">Total number of users</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FiArchive />
                    </div>
                    <div className="stat-title">Artworks</div>
                    <div className="stat-value text-primary">{dashboardNumbers.data?.artworkCount}</div>
                    <div className="stat-desc">Total number of artworks</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FiList />
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