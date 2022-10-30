import React, { useState, createContext } from "react";

export const MenuContext = createContext(null);
function MenuContextProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <MenuContext.Provider value={{ isOpen, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
}

export default MenuContextProvider;
