import React from "react";

import { FaWallet } from "react-icons/fa";
function Account(): JSX.Element {
    return (
        <button className="flex-center-center border border-cerulean text-cerulean gap-x-2 px-2 py-2 rounded-[10px]">
            {/* <span>0x00</span> */}
            <button className="flex-center-between gap-x-2">
                <FaWallet className="inline" />
                Connect Wallet
            </button>
        </button>
    );
}

export default Account;
