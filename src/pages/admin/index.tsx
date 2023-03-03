import { type ReactElement } from "react";
import AdminLayout from "~/components/AdminLayout";
import { type NextPageWithLayout } from "../_app";

const AdminPage: NextPageWithLayout = () => {
    return <>
        hi
    </>
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>{page}</AdminLayout>
    )
}

export default AdminPage