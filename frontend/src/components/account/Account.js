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
           {!currentAccount ? (
            <button
              onClick={connectWallet}
             

               
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={disconnectWallet}
            
            >
              Disconnect Wallet
            </button>
          )}
        </button>
        
    );
}

export default Account;
