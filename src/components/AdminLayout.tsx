import { UserRole } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import type { ReactElement } from "react";
import AdminHeader from "./AdminHeader";
import { LoadingSpinner } from "./LoadingSpinner";

export default function AdminLayout({ children }: { children: ReactElement }) {
    const session = useSession();

    if (session.status === 'loading') {
        return (
            <div className="pb-20 flex h-screen justify-center items-center">
                <LoadingSpinner className="h-8 w-8 text-primary" />
            </div>
        );
    }

    if (session.status === 'unauthenticated' || session.data?.user.role !== UserRole.ADMIN) {
        void signIn();
        return null;
    }

    return (
        <>
            <div className="">
                <AdminHeader />

                <div className="pt-[4.64rem] min-h-screen md:px-12 lg:px-32">
                    {children}
                </div>
            </div>
        </>
    )
}