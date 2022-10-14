import { createContext, useState, useEffect} from 'react';

import { ethers } from 'ethers';

export const AppContext = createContext("");

const { ethereum } = window;

export const AppContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const provider = new ethers.providers.Web3Provider(ethereum);
  
  
 



  const checkIfWalletIsConnect = async () => {
    
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
      //  setCurrentAccount(await provider.lookupAddress(accounts[0]));
      setCurrentAccount(accounts[0]);
//         var address = '0x1234...';
// var name = await provider.lookupAddress(address);
// // ethers.js automatically checks that the forward resolution matches.

      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const connectWallet = async () => {
   
    try {
     
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  const disconnectWallet = async () => {
    setCurrentAccount("");
    sessionStorage.clear();
    window.location.reload();
  }
  

  useEffect(() => {
    checkIfWalletIsConnect();
  }, [])
  
    return (
        <AppContext.Provider value={{ currentAccount,
            connectWallet,
            disconnectWallet,
            provider
           }}>{ children }</AppContext.Provider>
    );
};