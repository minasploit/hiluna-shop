import { type ReactElement } from "react";

import Home from "~/pages";
import AppLayout from "~/components/AppLayout";
import AdminLayout from "./AdminLayout";
import AdminPage from "~/pages/admin";
import ManageArtworks from "~/pages/admin/artworks";
import NewArtwork from "~/pages/admin/artworks/new";
import Artworks from "~/pages/artworks";
import ManageMedium from "~/pages/admin/medium";
import NewMedium from "~/pages/admin/medium/new";
import EditMedium from "~/pages/admin/medium/[id]";
import ManageCollection from "~/pages/admin/collections";
import NewCollection from "~/pages/admin/collections/new";
import EditCollection from "~/pages/admin/collections/[id]";
import EditArtwork from "~/pages/admin/artworks/[id]";
import ArtworkDetail from "~/pages/artworks/[hashedId]";
import ManageOrders from "~/pages/admin/orders";
import Checkout from "~/pages/checkout";
import Orders from "~/pages/orders";
import ManageOrder from "~/pages/admin/orders/[id]";
import Favorites from "~/pages/favorites";
import Portfolio from "~/pages/portfolio";

const UserLayoutPages = [
    Home,
    Artworks,
    ArtworkDetail,
    Checkout,
    Orders,
    Favorites,
    Portfolio
];

const AdminLayoutPages = [
    AdminPage,
    ManageArtworks,
    NewArtwork,
    EditArtwork,
    ManageMedium,
    NewMedium,
    EditMedium,
    ManageCollection,
    NewCollection,
    EditCollection,
    ManageOrders,
    ManageOrder
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