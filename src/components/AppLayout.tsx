import type { ReactElement } from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function AppLayout({ children }: { children: ReactElement }) {
    return (
        <>
            <div className="">
                <Header />

                <div className="pt-[4.14rem] min-h-screen">
                    {children}
                </div>

                <Footer />
            </div>
        </>
    )
}