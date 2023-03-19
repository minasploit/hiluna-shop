import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "~/hooks/useTheme";

const SwitchTheme = () => {
    const { theme, toggleTheme, lightTheme } = useTheme();

    return (
        <label className="swap swap-rotate btn btn-circle btn-ghost" onInput={toggleTheme}>
            <input type="checkbox" defaultChecked={theme === lightTheme} />

            <FiSun className="swap-on w-5 h-5" />

            <FiMoon className="swap-off w-5 h-5" />
        </label>
    );
};
export default SwitchTheme;