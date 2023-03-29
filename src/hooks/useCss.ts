const css = `
:root {
    --productWidth: 14%;
    --thickness: 1vw;
    --backgroundColor: #444444;
}

[data-theme="garden"] #animationDiv {
    background-color: #dedede;
}

[data-theme="halloween"] #animationDiv {
    background-color: #2f2f2f;
}

[data-theme="halloween"] #sale-heading {
    color: #9FE973;
}

[data-theme="garden"] #stock-heading {
    color: #9FE973;
}

[data-theme="halloween"] #stock-heading {
    color: #08311D;
}

#divvvv {
    backdrop-filter:blur(10px);
    -webkit-mask: -webkit-gradient(
        linear,
        left 50%,
        left 0%,
        from(rgb(255 11 11)),
        to(rgb(213 255 0 / 0%))
    )
}

#slideshowparentcontainer {
    display: block;
    box-sizing: border-box;
    // max-width: 1800px;
    margin: auto;
    margin-top: -1px;
    text-align: center;
}

#slideshowparent {
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    /* height: 0px; */
    padding-bottom: 35%;
    /* border-bottom: 1px solid #CCCCCC; */
    border-radius: 0px;
    overflow: hidden;
    box-shadow: none;
}

@keyframes example {
    0% {
        transform: rotateY(0deg);
    }

    100% {
        transform: rotateY(-20deg);
    }
}

@keyframes wiggle {
    0% {
        transform: rotateZ(-1deg);
    }

    100% {
        transform: rotateZ(1deg);
    }
}

#animationDiv {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
    overflow: hidden;
    /* perspective: 1000px; */
    perspective: 600px;
    /* background-color: #FFFFFF; */
}

#annimationTextDiv {
    display: inline-flex;
    box-sizing: border-box;

    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;

    position: absolute;
    z-index: 2;
    top: 0px;
    left: 0px;
    width: 30%;
    height: 100%;
    padding-left: 5%;
}

#animationTextLine001 {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 1%;
    margin-top: -10%;
    font-size: 1.5vw;
    font-family: montserratregular, arial;
    /* color: #222222; */
    text-transform: uppercase;
    line-height: 100%;
}

#animationTextLine002 {
    float: none;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    padding: 0px;
    margin: 0px;
    font-size: 3.5vw;
    font-family: montserratregular, arial;
    /* color: #222222; */
    text-transform: uppercase;
    line-height: 100%;
    text-shadow: 0.0vw 0.30vw 0.0vw rgba(0, 0, 0, 0.10);
    letter-spacing: 0.1vw;
    word-spacing: 0.1vw;
}

#animationProductDiv {
    display: inline-flex;

    flex-direction: row;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    box-sizing: border-box;
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 35%;
    width: 80%;
    height: 100%;
    padding-top: 0%;
    margin-top: -11%;
    /*transform: rotateX(5deg) rotateY(-5deg) rotateZ(2deg) translateX(-2%);*/
    transform: rotateX(0deg) rotateY(-10deg) rotateZ(0deg) translateX(-5%);
    transition: transform 1s;
    perspective: 2000px;
    perspective-origin: 50% 50%;
    border: 1px solid #FF0000;
    border: none;
    text-align: left;

}

#animationButtonTemplateContainerDiv {
    display: inline-block;
    width: 100%;
    margin-top: 8%;
    font-size: 0.90vw;
    font-family: arial;
    line-height: 100%;
    vertical-align: middle;
}

.buttonTemplate {
    display: inline-block;
    font-size: inherit;
    font-family: arial;
    vertical-align: middle;
    line-height: 100%;
    margin-bottom: 10px;
    outline: none;
}

.buttonTemplate:focus {
    outline: none;
}

.buttonTemplate[data-selected='1'] {
    text-decoration: underline;
}

.buttonTemplate::after {
    content: "|";
    display: inline-block;
    vertical-align: middle;
    padding-left: 5px;
    padding-right: 3px;
    font-size: inherit;
    font-family: arial;
    color: #444444;
    line-height: 100%;
}

.buttonTemplate:last-of-type::after {
    display: none;
}

.cube {
    display: inline-block;
    width: var(--productWidth);
    margin-right: 3%;
    margin-bottom: 3%;
    height: 0px;
    padding-bottom: calc(var(--productWidth) * 1.41);
    position: relative;
    /*transition: all 1s;*/
    transition: transform 1.2s, width 1s, height 1s, padding 1s;
    transform-style: preserve-3d;
    /*transform: rotateY(-15deg);*/
    vertical-align: middle;
}

.cube:nth-child(2) {
    width: calc(var(--productWidth)*0.5);
    padding-bottom: calc(var(--productWidth) * 1.20);
}

.cube:nth-child(3) {
    width: calc(var(--productWidth)*2.0);
}

.cube:nth-child(7) {
    width: calc(var(--productWidth)*2.5);
    padding-bottom: calc(var(--productWidth) * 1.60);

    // animation-name: example;
    // animation-duration: 4.00s;
    // animation-iteration-count: infinite;
    // animation-direction: alternate;
    // animation-timing-function: ease-in-out;
    // animation-play-state: running;

}

.cube:nth-child(9) {
    width: calc(var(--productWidth)*1.5);
    padding-bottom: calc(var(--productWidth) * 1.60);
}

.cube:nth-child(12) {
    width: calc(var(--productWidth)*1.5);
    padding-bottom: calc(var(--productWidth) * 1.70);
}

.cube[data-orientation='1'] {
    transform: scale3d(1.00, 1.00, 1.00) rotateY(-180deg);
}

.cubeFace {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: var(--backgroundColor);
    border: none;
    opacity: 1.0;
}

.cubeFaceFront,
.cubeFaceBack {
    background-color: #FFFFFF;
}

.cubeFace img {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 1.20vw;
    border: 0.5vw solid var(--backgroundColor);
    object-fit: cover;
    box-shadow: 0.1vw 0.1vw 0.25vw #999999 inset;
}

.cubeFaceBack {
    box-shadow: 0px 24px 8px -12px rgba(0, 0, 0, 0.25);
}

.cubeFaceFront {
    transform: rotateY(0deg);
}

.cubeFaceBack {
    transform: rotateY(180deg) translateZ(calc(var(--thickness)));
}

.cubeFaceTop {
    top: 0px;
    left: 0px;
    width: 100%;
    height: var(--thickness);
    transform-origin: top left;
    transform: rotateX(-90deg);
}

.cubeFaceBottom {
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: var(--thickness);
    transform-origin: bottom left;
    transform: rotateX(90deg);
}

.cubeFaceLeft {
    top: 0px;
    left: 0px;
    width: var(--thickness);
    height: 100%;
    transform-origin: top left;
    transform: rotateY(90deg);
}

.cubeFaceRight {
    top: 0px;
    right: 0px;
    width: var(--thickness);
    height: 100%;
    transform-origin: top right;
    transform: rotateY(-90deg);
}

#animationButton,
#animationButton:active,
#animationButton:link,
#animationButton:visited {
    display: inline-block;
    padding: 0.75vw;
    padding-left: 1.25vw;
    padding-right: 1.25vw;
    margin-top: 1.5vw;
    font-size: 1.25vw;
    font-family: montserrateregular, arial;
    /* color: rgba(0, 0, 0, 1.0); */
    text-transform: uppercase;
    background-color: rgba(0, 0, 0, 0.05);
    /* border: 0.15vw solid rgba(0, 0, 0, 0.30); */
}

#animationButton:hover {
    color: #FFFFFF;
    background-color: #222222;
    border-color: #222222;
    box-shadow: 0.0vw 0.50vw 0.15vw -0.25vw rgba(0, 0, 0, 0.10);
}


/* Template: threeWide */
#animationDiv[data-template-id='threeWide'] {
    --productWidth: 20%;
    background-color: #EEEEEE;
    --backgroundColor: #000000;
}

#animationDiv[data-template-id='threeWide'] #animationProductDiv {
    margin-top: 0%;
    align-content: center;
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0);
}

#animationDiv[data-template-id='threeWide'] .cube {
    width: var(--productWidth);
    padding-bottom: calc(var(--productWidth) * 1.41) !important;
}

#animationDiv[data-template-id='threeWide'] .cube:nth-child(1) {
    animation-name: example;
    animation-duration: 8.00s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
    animation-play-state: running;
}

#animationDiv[data-template-id='threeWide'] .cube:nth-child(2) {
    width: calc(var(--productWidth)*1.6);

}

#animationDiv[data-template-id='threeWide'] .cube:nth-child(n + 4) {
    display: none !important;
}


/* Template: threeWideSameWidth */
#animationDiv[data-template-id='threeWideSameWidth'] {
    --productWidth: 20%;
    background-color: #EEEEEE;
    --backgroundColor: #000000;
}

#animationDiv[data-template-id='threeWideSameWidth'] #animationProductDiv {
    margin-top: 0%;
    align-content: center;
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0);
}

#animationDiv[data-template-id='threeWideSameWidth'] .cube {
    width: var(--productWidth);
    padding-bottom: calc(var(--productWidth) * 1.41) !important;
}

#animationDiv[data-template-id='threeWideSameWidth'] .cube:nth-child(1) {
    animation-name: example;
    animation-duration: 8.00s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
    animation-play-state: running;
}

#animationDiv[data-template-id='threeWideSameWidth'] .cube:nth-child(n + 4) {
    display: none !important;
}



/* Template: sportsIllustrated */
#animationDiv[data-template-id='sportsIllustrated'] {
    --productWidth: 16%;
    background-color: #FFFFFF;
    --backgroundColor: #000000;

    /*background-image: url('/images/backgroundHomepageTextureWood002.jpg');
    background-size: cover;*/
}

#animationDiv[data-template-id='sportsIllustrated'] .cube {
    width: var(--productWidth);
    padding-bottom: calc(var(--productWidth) * 1.41) !important;
}

#animationDiv[data-template-id='sportsIllustrated'] .cube:nth-child(1) {
    animation-name: example;
    animation-duration: 8.00s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
    animation-play-state: running;
}

@media screen and (min-width: 9800px) {
    #animationTextLine001 {
        padding-bottom: 1%;
        margin-top: -10%;
        font-size: 24pt;
    }

    #animationTextLine002 {
        font-size: 36pt;
        text-shadow: none;
    }

    #animationButtonTemplateContainerDiv {
        font-size: 14pt;
    }

    #animationButton,
    #animationButton:active,
    #animationButton:link,
    #animationButton:visited {
        display: inline-block;
        padding: 25px;
        margin-top: 20px;
        font-size: 20pt;
        border: 2px solid rgba(0, 0, 0, 0.30);
    }
}

@media screen and (max-width: 640px) {
    [data-theme="garden"] #animationDiv {
        background-color: inherit;
    }
    
    [data-theme="halloween"] #animationDiv {
        background-color: inherit;
    }

    @keyframes example {
        0% {
            transform: rotateY(-30deg);
        }

        100% {
            transform: rotateY(0deg);
        }
    }

    #animationDiv {
        --productWidth: 70% !important;
        --thickness: 10px;

        padding-bottom: 100%;
        perspective: 1000px;
        /* background-color: #F9F9F9 !important; */
    }

    #annimationTextDiv {
        width: 60%;
        height: 100%;
        padding-left: 5%;
        padding-right: 5%;
    }

    #animationProductDiv {
        left: 55%;
        width: 80%;
        height: 100%;
        padding-top: 0%;
        margin-top: 0%;
        align-content: center;
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0) !important;
    }

    #animationTextLine001 {
        padding-bottom: 3%;
        font-size: 2.8vw;
    }

    #animationTextLine002 {
        font-size: 6.0vw;
        padding-bottom: 2%;
    }

    #animationButton,
    #animationButton:active,
    #animationButton:link,
    #animationButton:visited {
        padding: 2.0vw;
        padding-left: 2.5vw;
        padding-right: 2.5vw;
        margin-top: 2.5vw;
        font-size: 4.0vw;
        border-width: 0.50vw;
    }

    #animationButtonTemplateContainerDiv {
        display: none;
    }

    .cube:nth-child(n),
    #animationDiv[data-template-id='sportsIllustrated'] .cube:nth-child(n),
    #animationDiv[data-template-id='threeWide'] .cube:nth-child(n) {
        display: inline-block !important;
        width: var(--productWidth) !important;
        padding-bottom: calc(var(--productWidth) * 1.41) !important;
        transform: rotateY(-30deg);
    }

    .cube:nth-child(n + 2),
    #animationDiv[data-template-id='sportsIllustrated'] .cube:nth-child(n + 2),
    #animationDiv[data-template-id='threeWide'] .cube:nth-child(n + 2) {
        display: none !important;
        animation: none ! important;
    }

    .cube:nth-child(1) {
        animation-name: example;
        animation-duration: 6.00s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: ease-in-out;
        animation-play-state: running;
    }

    .cubeFace img {
        padding: 4.0vw;
        border: 2.0vw solid var(--backgroundColor);
    }

}
`

export default css