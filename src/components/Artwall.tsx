import { type NextPage } from "next";
import useCss from "~/hooks/useCss";

const Artwall: NextPage = () => {
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
            <div id="slideshowparent" className="h-[450px] md:h-0 hide">
                <div className="slideDiv z-[2] left-0" id="slideshow-0" tabIndex={0} title="Shop for Art">
                    <div id="animationDiv" data-template-id="default">

                        <div id="annimationTextDiv">
                            {/* <img src="/Making art-home.svg" alt="" />
                            <div className="-mt-52 border-2 border-white">
                                <div className="rounded-3xl backdrop-blur-xl p-4">
                                    hiasdkjfn
                                </div>
                            </div> */}
                            {/* <p id="animationTextLine001">Shop for</p>
                            <h1 id="animationTextLine002">Art Youll Love</h1>
                            <a type="button" id="animationButton" href="/wall-art">Shop Now</a>

                            <div id="animationButtonTemplateContainerDiv">
                                <button type="button" class="buttonTemplate" onclick="changeTemplate(event);" data-target-template-id="wallArt" data-selected="1" style="display: inline-block;">Featured Artwork</button>
                                <button type="button" class="buttonTemplate" onclick="changeTemplate(event);" data-target-template-id="photography" style="display: inline-block;">Photography</button>
                                <button type="button" class="buttonTemplate" onclick="changeTemplate(event);" data-target-template-id="sportsIllustrated" style="display: inline-block;">Sports Illustrated</button>
                            </div> */}

                        </div>

                        <div id="animationProductDiv">
                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/self-portrait-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/self-portrait-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/xmas-panda-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/xmas-panda-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/all-you-need-is-love-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/all-you-need-is-love-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/winter-koala-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/winter-koala-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/cool-lion-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/cool-lion-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/winter-owl-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/winter-owl-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/the-winner-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/the-winner-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/dinner-time-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/dinner-time-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/winter-is-coming-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/winter-is-coming-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/dont-let-the-sun-go-down-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/dont-let-the-sun-go-down-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/dancing-queen-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/dancing-queen-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/floral-lion-iii-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/floral-lion-iii-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/being-normal-is-boring-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/being-normal-is-boring-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/santa-lion-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/santa-lion-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/lovely-leopard-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/lovely-leopard-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/im-not-your-clown-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/im-not-your-clown-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/hipster-lion-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images-medium-5/hipster-lion-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/xmas-cat-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/xmas-cat-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/let-them-fly-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/let-them-fly-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/summer-koala-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/summer-koala-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/same-shit-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/same-shit-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/festival-lion-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/festival-lion-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/rebel-girl-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/rebel-girl-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/3/censored-dog-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/3/censored-dog-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/say-my-name-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/say-my-name-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/siberian-tiger-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/siberian-tiger-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/stay-cool-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/stay-cool-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/i-want-to-ride-my-bicycle-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/i-want-to-ride-my-bicycle-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/wet-dog-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/wet-dog-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/my-heart-goes-boom-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/my-heart-goes-boom-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/born-to-be-free-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/born-to-be-free-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/skull-with-red-glasses-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/1/skull-with-red-glasses-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/bad-panda-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/bad-panda-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/3/stay-cool-ii-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/3/stay-cool-ii-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                            <div id="" className="cube" data-orientation="0" onMouseOver={onMouseOver}>
                                <div className="cubeFace cubeFaceFront"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/i-need-more-space-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/i-need-more-space-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceBack"><img className=" ls-is-cached lazyloaded" src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/im-your-father-balazs-solti.jpg" data-src="https://render.fineartamerica.com/images/rendered/default/print/images/artworkimages/medium/2/im-your-father-balazs-solti.jpg" /></div>
                                <div className="cubeFace cubeFaceRight"></div>
                                <div className="cubeFace cubeFaceLeft"></div>
                                <div className="cubeFace cubeFaceTop"></div>
                                <div className="cubeFace cubeFaceBottom"></div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Artwall