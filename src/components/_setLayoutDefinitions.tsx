import { type ReactElement } from "react";

import Home from "~/pages";
import AppLayout from "~/components/AppLayout";
import AdminLayout from "./AdminLayout";
import AdminPage from "~/pages/admin";
import ManageArtworks from "~/pages/admin/artworks";
import NewArtwork from "~/pages/admin/artworks/new";
import Artworks from "~/pages/artworks";
import Collections from "~/pages/collections";
import Form from "~/pages/form";
import ManageMedium from "~/pages/admin/medium";
import NewMedium from "~/pages/admin/medium/new";
import EditMedium from "~/pages/admin/medium/[id]";
import ManageCollection from "~/pages/admin/collections";
import NewCollection from "~/pages/admin/collections/new";
import EditCollection from "~/pages/admin/collections/[id]";

const UserLayoutPages = [
    Home,
    Artworks,
    Collections,
    Form
];

const AdminLayoutPages = [
    AdminPage,
    ManageArtworks,
    NewArtwork,
    ManageMedium,
    NewMedium,
    EditMedium,
    ManageCollection,
    NewCollection,
    EditCollection
];

export default function setLayoutDefinitions() {
    UserLayoutPages.forEach(page => {
        page.getLayout = function getLayout(page: ReactElement) {
            return (
                <AppLayout>{page}</AppLayout>
            )
        }
    });

    AdminLayoutPages.forEach(page => {
        page.getLayout = function getLayout(page: ReactElement) {
            return (
                <AdminLayout>{page}</AdminLayout>
            )
        }
    })
}