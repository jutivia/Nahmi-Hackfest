import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MenuContext } from "../../contexts/MenuContext";

const menuLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bond", path: "/bond" },
    { name: "Stake", path: "/stake" },
    { name: "Trade", path: "/trade" },
];
function NavLinks() {
    const { activeLink, handleSelectedLink } = useContext(MenuContext);

    return (
        <React.Fragment>
            {menuLinks.map((menuLink) => (
                <Link
                    to={menuLink.path}
                    key={menuLink.name}
                    onClick={() => handleSelectedLink(menuLink.path)}
                    className={`nav-link mobile-nav-link block leading-[3] sm:leading-[5] relative pl-8 lg:px-4 lg:transition-[width] duration-300 outline-0 w-full ${
                        activeLink === menuLink.path
                            ? "active text-cerulean"
                            : " text-white"
                    }`}
                >
                    {menuLink.name}
                    <span
                        className={`purple-gradient mx-auto absolute lg:bottom-0 left-0 rounded-tr rounded-br lg:rounded-br-[unset] lg:right-0 h-full lg:h-[3px] lg:rounded-tl lg:rounded-tr w-0 ${
                            activeLink === menuLink.name
                                ? "h-full lg:h[3px] w-[3px] lg:w-full"
                                : ""
                        }`}
                    ></span>
                </Link>
            ))}
        </React.Fragment>
    );
}

export default NavLinks;
