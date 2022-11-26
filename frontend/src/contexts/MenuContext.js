import React, { useState, createContext } from "react";
import { useLocation } from "react-router-dom";

export const MenuContext = createContext(null);
function MenuContextProvider({ children }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleSelectedLink = (selected) => {
        setActiveLink(selected);
    };

    return (
        <MenuContext.Provider
            value={{
                isOpen,
                toggleMenu,
                handleSelectedLink,
                activeLink,
                location,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}

export default MenuContextProvider;
