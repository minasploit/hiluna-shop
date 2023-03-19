import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export function useTheme() {
    const lightTheme = "garden";
    const darkTheme = "halloween";

    const [theme, setTheme] = useLocalStorage("theme", lightTheme);

    const toggleTheme = () => {
        setTheme(theme === darkTheme ? lightTheme : darkTheme);
    };

    useEffect(() => {
        const body = document.body;

        body.setAttribute("data-theme", theme);
    }, [theme]);

    return { theme, toggleTheme, lightTheme, darkTheme }
}