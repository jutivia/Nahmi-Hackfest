import React, { useContext } from "react";
import { MenuContext } from "../../contexts/MenuContext";
import NavLinks from "../nav-links/NavLinks";
import DisconnectWallet from "../buttons/disconnect-wallet/DisconnectWallet";
import Faucet from "../faucet/Faucet";

function MenuModal() {
    const { isOpen, toggleMenu } = useContext(MenuContext);
    if (isOpen && typeof window !== "undefined" && window.document) {
        document.body.style.overflowY = "hidden";
    }
    return (
        <section
            className={` ${
                isOpen ? "small-overlay translate-x-0" : "translate-x-[-250%]"
            }`}
            onClick={toggleMenu}
        >
            <div
                className={`glass w-[75%] flex-start-between py-8 flex-col h-full gap-y-4 sm:gap-y-8 absolute left-0 top-0 bottom-0 transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-[-250%]"
                } `}
            >
                <div className="text-center w-full mx-auto flex-center-center flex-col gap-x-[0.25rem] sm:gap-x-4 absolute z-[999] bottom-0 left-0 right-0 bg-richBlack lg:bg-[transparent] lg:relative"></div>
                <div className="flex-center-center flex-col w-full  gap-y-4">
                    <NavLinks />
                </div>
                <div>
                    <Faucet />
                    <DisconnectWallet />
                </div>
            </div>
        </section>
    );
}

export default MenuModal;
