import React, { useState, useEffect, createContext, useCallback } from "react";
import { ethers, utils, Contract } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ASSET_TOKEN_CONTRACT, ASSET_TOKEN_ADDRESS } from '../utils/constants/constants'

export const Web3Context = createContext(null);
const toastConfig = { autoClose: 5000, theme: "dark", position: "bottom-left" };

function Web3ContextProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [connected, setConnected] = useState(false);
    const [accountBalance, setAccountBalance] = useState({
        tokenBalance: 0,
        coinBalance: 0,
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);

    // Requests wallet connection
    const connectWallet = async () => {
        if(connected) return
        if (window.ethereum || window.web3) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                await eagerConnect();
                if (connected) {
                    setAccount(accounts[0]);
                    toast.success("Connected!", toastConfig);
                }
            } catch (error) {
                toast.error(error? error.message.slice(0,50) : 'Connection failed', toastConfig);
                console.error(error);
            }
        } else {
            toast.error(
                "Please Use a Web3 Enable Browser or Install Metamask",
                toastConfig
            );
        }
    };

    const disconnectWallet = () => {
        setConnected(false);
    };

    const getContractWithProvider = (contractAddress,contractABI ) => {
        return new Contract(contractAddress, contractABI, provider);
    };
    const getContractWithSigner = (contractAddress,contractABI ) => {
        return new Contract(contractAddress, contractABI, signer);
    };

    const getTokenBalance = async (address) => {
        if (connected) {
            try {
                const contract = getContractWithProvider(ASSET_TOKEN_ADDRESS, ASSET_TOKEN_CONTRACT);
                const balance = await contract.balanceOf(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                 toast.error(error? error.message.slice(0,50) : 'Connection failed', toastConfig);
                console.error(error);
            }
        }
    };

    const getCoinBalance = async (address) => {
        if (connected) {
            try {
                const balance = await provider.getBalance(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                 toast.error(error? error.message.slice(0,50) : 'Connection failed', toastConfig);
                console.error(error);
            }
        }
    };

    // Eagerly connects user and fetches their account data
    const eagerConnect = async () => {
        const networkID = await window.ethereum.request({
            method: "eth_chainId",
        });
        if (Number(networkID) !== 5554) {
            setConnected(false);
            return toast.error(
                "You are currently connected to an unsupported network, please switch to Nahmii Testnet 3",
                toastConfig
            );
        }
        const accounts = await provider.listAccounts();
        if (!accounts.length) return;
        // await updateAccountData()
        setConnected(true);
    };

    const claimFreeTokens = async () => {
        if (account) {
            try {
                const contract = getContractWithSigner(ASSET_TOKEN_ADDRESS, ASSET_TOKEN_CONTRACT);
                await contract.mint(account, utils.parseEther('1000'));
            } catch (error) {
                 toast.error(error? error.message.slice(0,50) : 'Connection failed', toastConfig);
                console.error(error);
            }
        }
    };

    //Alerts user to switch to a supported network when account is switched from a supported network
    const handleAccountChanged = useCallback(async () => {
        if (account) {
            try {
                const networkID = await window.ethereum.request({
                    method: "eth_chainId",
                });
                if (Number(networkID) !== 5554) {
                    return toast.error(
                        "You are currently connected to an unsupported network, please switch to Nahmii Testnet 3",
                        toastConfig
                    );
                } else {
                    const accounts = await provider.listAccounts();
                    setAccount(accounts[0]);
                }
            } catch (error) {
                 toast.error(error? error.message.slice(0,50) : 'Connection failed', toastConfig);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    //Alerts user to switch to a supported network when account is switched from a supported network
    const handleChainChanged = async () => {
        const networkID = await window.ethereum.request({
            method: "eth_chainId",
        });
        if (Number(networkID) !== 5554) {
            setConnected(false);
            return toast.error(
                "You are currently connected to an unsupported network, please switch to Nahmii Testnet 3",
                toastConfig
            );
        } else {
            setConnected(true);
        }
    };

    const init = async () => {
        connectWallet();
        const accounts = await provider.listAccounts();
        if (!accounts.length) return;
        const tokenBalance = await getTokenBalance(accounts[0]);
        const coinBalance = await getCoinBalance(accounts[0]);
        setAccountBalance({
            tokenBalance,
            coinBalance,
        });
        setAccount(accounts[0]);
        setConnected(true);
    };
    useEffect(() => {
        init();
        if (!window.ethereum) return;

        window.ethereum.on("connect", eagerConnect);
        window.ethereum.on("accountsChanged", handleAccountChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = {
        account,
        connected,
        connectWallet,
        disconnectWallet,
        accountBalance,
        claimFreeTokens,
    };
    return (
        <Web3Context.Provider
            value={
              value
            }
        >
            {children}
        </Web3Context.Provider>
    );
}

export default Web3ContextProvider;
