import React, { useContext } from "react";
import { FaWallet } from "react-icons/fa";
import { Web3Context } from "../../contexts/Web3Context";
import { shortenAddress } from "../../utils/helper/shortenAddress";

function Account() {
    const { account, connected, connectWallet } = useContext(Web3Context) || {};
    // const value = useContext(Web3Context) || {};
    const connectedAccount = shortenAddress(account);

    // console.log("value:", value);
    console.log(account);
    console.log(connected);
    console.log(connectWallet);
    console.log(connectedAccount);
    return (
        <button
            className="flex-center-center btn-no-fill"
            onClick={connectWallet}
        >
            <span className="flex-center-between gap-x-2">
                <FaWallet className="inline" />
                {connected ? connectedAccount : "Connect Wallet"}
            </span>
        </button>
    );
}

export default Account;
