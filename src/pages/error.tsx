import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

const Error: NextPageWithLayout = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const { error } = router.query;

    useEffect(() => {
        const errorMessages = [
            { code: "Configuration", message: "There is an error in the way that the server is configured. Please try again later." },
            { code: "AccessDenied", message: "You're not allowed to access the specified url." },
            { code: "Verification", message: "The token used has expired or has already been used." },
        ]

        const message = errorMessages.filter(e => e.code == error);

        if (message[0]) {
            setErrorMessage(message[0].message);
        } else {
            setErrorMessage("An unknown error occurred.");
        }
    }, [error])

    return <>
        <Head>
            <title>Error - Hiluna Art</title>
        </Head>

        <div className="min-h-screen flex justify-center items-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Error</h2>
                    <p>{errorMessage}</p>
                    <div className="card-actions justify-end mt-2">
                        <button className="btn btn-primary" onClick={() => router.push("/")}>Go to Home Page</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Error