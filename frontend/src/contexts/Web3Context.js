import React, { useState, useEffect, createContext, useCallback } from "react";
import { ethers, utils, Contract } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {} from '../constants/constants'

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
        // console.log("attempting to connect wallet...");
        if (window.ethereum || window.web3) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                await eagerConnect();
                // console.log("just afta eaga conet");
                if (connected) {
                    setAccount(accounts[0]);
                    toast.success("Connected!", toastConfig);
                }
            } catch (error) {
                toast.error(error.message, toastConfig);
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

    const getContract = () => {
        return new Contract(contractAddress, contractABI, provider);
    };

    const getTokenBalance = async (address) => {
        if (connected) {
            try {
                const contract = getContract();
                const balance = await contract.balanceOf(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                toast.error(error.message, toastConfig);
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
                toast.error(error.message, toastConfig);
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
                const contract = new Contract(
                    contractAddress,
                    contractABI,
                    signer
                );
                await contract.mint(account, utils.parseEther('1000'));
            } catch (error) {
                toast.error(error.message, toastConfig);
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
                toast.error(error.message, toastConfig);
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
        console.log("attempting to connect wallet...");
        console.log(provider);
        console.log(await provider.listAccounts());
        const networkID = await window.ethereum.request({
            method: "eth_chainId",
        });
        console.log(Number(networkID));
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

    // const value = {
    //     account,
    //     connected,
    //     connectWallet,
    //     disconnectWallet,
    //     accountBalance,
    //     claimFreeTokens,
    // };
    return (
        <Web3Context.Provider
            value={{
                account,
                connected,
                connectWallet,
                disconnectWallet,
                accountBalance,
                claimFreeTokens,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}

export default Web3ContextProvider;
