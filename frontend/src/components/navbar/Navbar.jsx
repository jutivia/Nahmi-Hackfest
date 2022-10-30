import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import nahmiiLogo from "../../assets/png/nahmii-logo-dark.png";
import { Account, Balance, Faucet } from "../../components";
import { Web3Context } from "../../contexts/Web3Context";
import MenuButton from "../buttons/menu-button/MenuButton";
import MenuModal from "../menu-modal/MenuModal";

const menuLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Bond", path: "/bond" },
    { name: "Stake", path: "/stake" },
    { name: "Trade", path: "/trade" },
];
const Navbar = () => {
    const { connected } = useContext(Web3Context);
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleSelectedLink = (selected) => {
        setActiveLink(selected);
    };

    return (
        <nav className="bg-richBlack text-white h-[10vh] flex-center-between px-4 sm:px-8 font-[500] w-full">
            <div className="flex-center-between gap-x-4">
                <div className="nav-logo xs:w-[6rem] sm:w-[8rem]">
                    <img
                        src={nahmiiLogo}
                        alt="Nahmii logo"
                        className="aspect-auto w-full"
                    />
                </div>
                <div className="text-center w-full mx-auto flex-center-center gap-x-[0.25rem] sm:gap-x-4 absolute bottom-0 left-0 right-0 bg-richBlack lg:relative ">
                    {menuLinks.map((menuLink) => (
                        <Link
                            to={menuLink.path}
                            key={menuLink.name}
                            onClick={() => handleSelectedLink(menuLink.path)}
                            className={`nav-link block leading-[4] sm:leading-[5] relative px-4 transition-[width] duration-300 outline-0  ${
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
                <div className="hidden lg:flex">{connected && <Faucet />}</div>
                <div className="hidden lg:flex">{connected && <Balance />}</div>
                <Account />
                <MenuButton />
            </div>
            <MenuModal />
        </nav>
    );
};

export default Navbar;
