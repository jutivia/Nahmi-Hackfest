import React, { useContext } from "react";
import { MenuContext } from "../../contexts/MenuContext";
import DisconnectWallet from "../buttons/disconnect-wallet/DisconnectWallet";

function MenuModal() {
    const { isOpen, toggleMenu } = useContext(MenuContext);
    return (
        isOpen && (
            <section
                className="overlay grid place-items-center"
                onClick={toggleMenu}
            >
                <div className="grid place-items-center">
                    <DisconnectWallet />
                </div>
            </section>
        )
    );
}

export default MenuModal;
