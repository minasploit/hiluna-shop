import useCss from "~/hooks/useCss";
import { resolveStaticResource } from "../utils/functions";
import Image from "next/image";
import Link from "next/link";

const ArtwallFrames = [
    {
        id: 1,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 2,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 3,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 4,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 5,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 6,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 7,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 8,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 9,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 10,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 11,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 12,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 13,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 14,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 15,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 16,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
    {
        id: 17,
        front: resolveStaticResource("5.jpg"),
        back: resolveStaticResource("5.jpg")
    },
]

const Artwall = ({ featuredMedium }: {
    featuredMedium: {
        id: number,
        name: string,
        href: string
    }[]
}) => {
    const style = useCss;

    let lastTarget: (EventTarget & HTMLDivElement) | null = null;

    function onMouseOver(e: React.MouseEvent<HTMLDivElement>) {
        if (e.currentTarget == lastTarget)
            return;

        lastTarget = e.currentTarget;

        const newValue = e.currentTarget.getAttribute("data-orientation") == "0" ? "1" : "0"
        e.currentTarget.setAttribute("data-orientation", newValue)
    }

    return <>
        <style jsx>
            {style}
        </style>

        <div id="slideshowparentcontainer">
            <div id="slideshowparent" className="h-[450px] md:h-0 hide mb-[-6.1px]">
                <div className="slideDiv z-[2] left-0" id="slideshow-0" tabIndex={0}>
                    <div id="animationDiv" data-template-id="default">
                        {/* <img src="/Making art-home.svg" alt="" className="hidden sm:block" /> */}

                        <div id="annimationTextDiv">
                            <p id="" className="text-lg sm:text-xl">Welcome to</p>
                            <h1 id="" className="text-3xl sm:text-3xl md:text-5xl">Hiluna Art</h1>
                            {/* <a type="button" id="animationButton" href="/wall-art">Shop Now</a> */}
                            <Link href="/artworks" className="btn btn-primary md:btn-wide mt-8">View Artworks</Link>

                            <div id="animationButtonTemplateContainerDiv">
                                {
                                    featuredMedium?.map(f => (
                                        <Link className="btn btn-link" key={`fav-${f.id}`} href={f.href}>{f.name}</Link>
                                    ))
                                }
                            </div>

                        </div>

                        <div id="animationProductDiv">
                            {
                                ArtwallFrames.map(frame => (
                                    <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver} key={`artwall-${frame.id}`}>
                                        <div className="cubeFace cubeFaceFront">
                                            <Image
                                                src={frame.front}
                                                alt="Artwork image"
                                                width={800} height={400}
                                                priority
                                            />
                                        </div>
                                        <div className="cubeFace cubeFaceBack">
                                            <Image
                                                src={frame.back}
                                                alt="Artwork image"
                                                width={800} height={400}
                                                priority
                                            />
                                        </div>
                                        <div className="cubeFace cubeFaceRight"></div>
                                        <div className="cubeFace cubeFaceLeft"></div>
                                        <div className="cubeFace cubeFaceTop"></div>
                                        <div className="cubeFace cubeFaceBottom"></div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Artwall