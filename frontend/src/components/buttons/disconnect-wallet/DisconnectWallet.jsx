import React, { useContext } from "react";
import { Web3Context } from "../../../contexts/Web3Context";

function DisconnectWallet() {
    const { disconnectWallet } = useContext(Web3Context);
    return (
        <button
            className="btn-filled px-4 py-2 font-[500]"
            onClick={disconnectWallet}
        >
            Disconnect
        </button>
    );
}

export default DisconnectWallet;
