import React from "react";
import { FaWallet } from "react-icons/fa";
import { shortenAddress } from "../../utils/helper/shortenAddress";
import Tokens from "./components/tokens/Tokens";

function Dashboard() {
    const account =
        "0x69ae994ec69b62e2bf59a78d02219b2ee2399c35d44d4d3b4a0e1c3e1e4f38bd";
    const connectedAccount = shortenAddress(account);
    return (
        <div className="grid place-items-center h-screen m-auto w-full">
            <div>
                <div className="flex-center-between gap-x-4 ">
                    <FaWallet className="inline aspect-square w-16 text-cerulean" />
                    <p>{connectedAccount}</p>
                </div>
                <button className="btn-filled px-4 py-2">Disconnect</button>
            </div>
            <Tokens />
        </div>
    );
}

export default Dashboard;
