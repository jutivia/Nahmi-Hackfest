import { ethers } from "ethers";
import { AppContext } from '../../context/AppContext';
import { FaWallet } from "react-icons/fa";
import {shortenAddress} from '../../utils/shortenAddress';
import React, {
 
  useContext
} from "react";
function Account() {
  const { currentAccount, connectWallet, disconnectWallet} = useContext(AppContext);

    return (
        <button className="flex-center-center border border-cerulean text-cerulean gap-x-2 px-2 py-2 rounded-[10px]">
            {!currentAccount
              ?   <button type="button" className="btn btn-primary"
              onClick={connectWallet}>Connect Wallet</button>
              : (
                <span></span>
              )}
        </button>
        
    );
}

export default Account;
