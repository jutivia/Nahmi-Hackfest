import React, { useState } from "react";
import { Link } from "react-router-dom";
import nahmiiLogo from "assets/png/nahmii-logo-dark.png";
import { Account, Balance, Faucet } from "components";

const menuLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Bond", path: "/bond" },
    { name: "Stake", path: "/stake" },
    { name: "Trade", path: "/trade" },
];
const Navbar = (): JSX.Element => {
    const [activeLink, setActiveLink] = useState<string>(location.pathname);

    const handleSelectedLink = (selected: string): void => {
        setActiveLink(selected);
    };
    return (
        <nav className="bg-richBlack text-white h-[10vh] flex-center-between px-8 font-[500]">
            <div className="flex-center-between gap-x-4">
                <div className="w-[8rem]">
                    <img
                        src={nahmiiLogo}
                        alt="Nahmii logo"
                        className="aspect-auto w-full"
                    />
                </div>
                <div className="flex-center-center  text-center mx-auto gap-x-4">
                    {menuLinks.map((menuLink) => (
                        <Link
                            to={menuLink.path}
                            key={menuLink.name}
                            onClick={() => handleSelectedLink(menuLink.path)}
                            className={`nav-link block leading-[5] relative px-4 transition-all duration-300 outline-0  ${
                                activeLink === menuLink.path
                                    ? "active text-cerulean"
                                    : ""
                            }`}
                        >
                            {menuLink.name}
                            <span
                                className={`purple-gradient mx-auto absolute bottom-0 left-0 right-0 h-[3px] rounded-tl rounded-tr w-0  ${
                                    activeLink === menuLink.name ? "w-full" : ""
                                }`}
                            ></span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex-center-between gap-x-4">
                <Faucet />
                <Balance />
                <Account />
            </div>
        </nav>
    );
};

export default Navbar;
