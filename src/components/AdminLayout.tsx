import { UserRole } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import type { ReactElement } from "react";
import Header from "./Header";
import { LoadingSpinner } from "./LoadingSpinner";

export default function AdminLayout({ children }: { children: ReactElement }) {

    const session = useSession();

    if (session.status === 'loading') {
        return (
            <div className="pb-20 flex h-screen justify-center items-center">
                <LoadingSpinner className="h-16 w-16 text-blue-700" />
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
                <Header />

                <div className="pt-[4.14rem]">
                    {children}
                </div>
            </div>
        </>
    )
}