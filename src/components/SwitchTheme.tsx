import React, { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useLocalStorage } from "usehooks-ts";

const lightTheme = "garden";
const darkTheme = "dark";

const SwitchTheme = () => {
    const [theme, setTheme] = useLocalStorage("theme", lightTheme);

    const toggleTheme = () => {
        setTheme(theme === darkTheme ? lightTheme : darkTheme);
    };

    useEffect(() => {
        const body = document.body;

        body.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <label className="swap swap-rotate btn btn-circle btn-ghost" onInput={toggleTheme}>
            <input type="checkbox" defaultChecked={theme === lightTheme} />

            <FiSun className="swap-on w-5 h-5" />

            <FiMoon className="swap-off w-5 h-5" />
        </label>
    );
};
export default SwitchTheme;