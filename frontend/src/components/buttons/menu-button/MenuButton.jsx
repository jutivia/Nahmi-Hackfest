import React, { useContext } from "react";
import { MenuContext } from "../../../contexts/MenuContext";

function MenuButton() {
    const { isOpen, toggleMenu } = useContext(MenuContext);

    return (
        <button
            className={`flex-center-between relative z-[1000] flex-col w-8 h-6 lg:hidden ${
                isOpen ? "" : ""
            }`}
            onClick={toggleMenu}
        >
            <span
                className={`bar w-full ${
                    isOpen ? "rotate-45 translate-y-[10px]" : ""
                }`}
                id="bar1"
            ></span>
            <span
                className={`bar w-[66%] ${isOpen ? "w-[0] opacity-0" : ""}`}
                id="bar2"
            ></span>
            <span
                className={`bar ${
                    isOpen
                        ? "rotate-[-45deg] translate-y-[-10px] w-full"
                        : "w-[100%]"
                }`}
                id="bar3"
            ></span>
        </button>
    );
}

export default MenuButton;
