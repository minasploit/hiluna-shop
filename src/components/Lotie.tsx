// import { type LottiePlayer } from 'lottie-web';
// import { useEffect, useRef, useState } from 'react';

// export default function Lotie({ src, className }: { src: string, className: string | undefined }) {
//     const ref = useRef<HTMLDivElement | null>(null);
//     const [lottie, setLottie] = useState<LottiePlayer | null>(null);

//     useEffect(() => {
//         void import('lottie-web').then(Lottie => setLottie(Lottie.default));
//     }, []);

//     useEffect(() => {
//         if (lottie && ref.current) {
//             const animation = lottie.loadAnimation({
//                 container: ref.current,
//                 renderer: 'svg',
//                 loop: true,
//                 autoplay: true,
//                 // path to your animation file, place it inside public folder
//                 path: src,
//             });

//             return () => animation.destroy();
//         }
//     }, [lottie, src]);

//     return <div ref={ref} className={className}></div>;
// }
export { }