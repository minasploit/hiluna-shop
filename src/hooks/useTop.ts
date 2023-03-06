import { useEffect, useState } from "react";

export function useTop() {
    const [top, setTop] = useState(true);

    useEffect(() => {
        const scrollHandler = () => {
            window.pageYOffset > 20 ? setTop(false) : setTop(true)
        };
        window.addEventListener('scroll', scrollHandler);

        return () => window.removeEventListener('scroll', scrollHandler);
    }, [top]);

    return top;
}