import { ConnectKitButton } from "connectkit";
import React from "react";

import { FaWallet } from "react-icons/fa";
function Account(): JSX.Element {
    return (
        <button className="flex-center-center btn-no-fill">
            <span className="flex-center-between gap-x-2">
                <FaWallet className="inline" />
                <ConnectKitButton/>
            </span>
        </button>
    );
}

export default Account;
