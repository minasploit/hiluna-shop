import clsx from "clsx";
import { type NextPageWithLayout } from "./_app";

const steps = [
    {
        name: 'Create account',
        date: 'March 2022',
        description: 'I am inspired by the intricate details of algae, Lichens, rust and weathered surfaces. My pieces are incredibly complex, working on layers and welding them together on the sewing machine over many weeks.',
    },
    {
        name: 'Profile information',
        date: 'Cursus semper viverra facilisis et et some more.',
        description: 'I am inspired by the intricate details of algae, Lichens, rust and weathered surfaces. My pieces are incredibly complex, working on layers and welding them together on the sewing machine over many weeks.',
    },
    {
        name: 'Business information',
        date: 'Penatibus eu quis ante.',
        description: 'I am inspired by the intricate details of algae, Lichens, rust and weathered surfaces. My pieces are incredibly complex, working on layers and welding them together on the sewing machine over many weeks.',
    },
    {
        name: 'Theme',
        date: 'Faucibus nec enim leo et.',
        description: 'I am inspired by the intricate details of algae, Lichens, rust and weathered surfaces. My pieces are incredibly complex, working on layers and welding them together on the sewing machine over many weeks.',
    },
    {
        name: 'Preview',
        date: 'Iusto et officia maiores porro ad non quas.',
        description: 'I am inspired by the intricate details of algae, Lichens, rust and weathered surfaces. My pieces are incredibly complex, working on layers and welding them together on the sewing machine over many weeks.',
    },
]

const Portfolio: NextPageWithLayout = () => {
    return <>
        <main className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6 lg:pb-24 lg:px-8">
            <div className="max-w-xl">
                <h1 className="text-primary text-4xl font-extrabold tracking-tight sm:text-3xl">My Portfolio</h1>
            </div>

            <div className="sm:grid sm:grid-cols-4 my-8">
                <div className="col-span-2 text-2xl">
                    Hello, I am Hilina Shibeshi.
                    A textile artist and painter based on Bodmin Moor, Cornwall.
                    My work is carefully built up of layers of fabric and paint which are brought together with many different stitching techniques.
                </div>
            </div>

            <h3 className="text-lg my-8 font-semibold">These are the exhibitions and competitions I&apos;ve participated in:</h3>

            <nav aria-label="Progress">
                <ol role="list" className="overflow-hidden">
                    {steps.map((step, stepIdx) => (
                        <li key={step.name} className={clsx(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
                            {stepIdx !== steps.length - 1 ? (
                                <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-primary" aria-hidden="true" />
                            ) : null}

                            <div className="relative flex items-start group" aria-current="step">
                                <span className="h-9 flex items-center" aria-hidden="true">
                                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full">
                                        <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                                    </span>
                                </span>
                                <span className="ml-4 min-w-0 flex flex-col">
                                    <span className="text-lg font-semibold tracking-wide uppercase text-primary">{step.name}</span>
                                    <span className="text-sm">{step.date}</span>
                                    <span className="text-md mt-2">{step.description}</span>
                                </span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
        </main>
    </>
}

export default Portfolio