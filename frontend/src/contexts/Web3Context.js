import React, { useState, useEffect, createContext } from "react";
import { ethers, utils, Contract } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    ASSET_TOKEN_CONTRACT,
    ASSET_TOKEN_ADDRESS,
    BOND_DEPO_ADDRESS,
    BOND_DEPO_CONTRACT,
    STAKING_CONTRACT,
    STAKING_ADDRESS,
    NIIT_ADDRESS,
    NIIT_CONTRACT,
} from "../utils/constants/constants";

export const Web3Context = createContext(null);
const toastConfig = { autoClose: 5000, theme: "dark", position: "bottom-left" };

function Web3ContextProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [connected, setConnected] = useState(false);
    const [bond, setBond] = useState(0);
    const [staked, setStakedBalance] = useState(0);
    const [maturity, setMaturity] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [accountBalance, setAccountBalance] = useState({
        tokenBalance: 0,
        coinBalance: 0,
        NiitBalance: 0,
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);

    // Requests wallet connection
    const connectWallet = async () => {
        if (connected) return;
        if (window.ethereum || window.web3) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]);
                await eagerConnect();
                if (connected) {
                    toast.success("Connected!", toastConfig);
                }
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
                console.error(error);
            }
        } else {
            toast.error(
                "Please Use a Web3 Enabled Browser or Install Metamask",
                toastConfig
            );
        }
    };

    const disconnectWallet = () => {
        setConnected(false);
        setAccount(null);
    };
    const refreshState = () => {
        const reload = setTimeout(() => {
            window.location.reload();
        }, 5000);
        return clearTimeout(reload);
    };
    // const getContractWithProvider = (contractAddress, contractABI) => {
    //     return new Contract(contractAddress, contractABI, provider);
    // };
    const getContractWithSigner = (contractAddress, contractABI) => {
        return new Contract(contractAddress, contractABI, signer);
    };

    const getAssetTokenBalance = async (address) => {
        if (!connected) {
            try {
                const contract = getContractWithSigner(
                    ASSET_TOKEN_ADDRESS,
                    ASSET_TOKEN_CONTRACT
                );
                const balance = await contract.balanceOf(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
                console.error(error);
            }
        }
    };
    const getNIITBalance = async (address) => {
        if (!connected) {
            try {
                const contract = getContractWithSigner(
                    NIIT_ADDRESS,
                    NIIT_CONTRACT
                );
                const balance = await contract.balanceOf(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
                console.error(error);
            }
        }
    };

    const getCoinBalance = async (address) => {
        if (!connected) {
            try {
                const balance = await provider.getBalance(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
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
                const contract = getContractWithSigner(
                    ASSET_TOKEN_ADDRESS,
                    ASSET_TOKEN_CONTRACT
                );
                const res = await contract.mint(
                    account,
                    utils.parseEther("1000")
                );
                await res.wait();
                toast.success("Minted 1000 AST", toastConfig);
                refreshState();
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
                console.error(error);
            }
        }
    };

    //Alerts user to switch to a supported network when account is switched from a supported network
    const handleAccountChanged = async () => {
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
                    refreshState();
                }
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
            }
        }
    };

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
            refreshState();
        }
    };

    const init = async () => {
        connectWallet();
        const accounts = await provider.listAccounts();
        if (!accounts.length) return;
        const coinBalance = await getCoinBalance(accounts[0]);
        const assetTokenBalance = await getAssetTokenBalance(accounts[0]);
        const NiitBalance = await getNIITBalance(accounts[0]);
        setAccountBalance({
            assetTokenBalance,
            coinBalance,
            NiitBalance,
        });
        setAccount(accounts[0]);
        checkExistingBond(accounts[0]);
        checkStakingBalance(accounts[0]);
        setConnected(true);
    };

    useEffect(() => {
        init();
        if (!window.ethereum) return;

        window.ethereum.on("connect", eagerConnect);
        window.ethereum.on("accountsChanged", handleAccountChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.removeListener("accountsChanged", handleAccountChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bondAST = async (amount) => {
        try {
            const contract = getContractWithSigner(
                BOND_DEPO_ADDRESS,
                BOND_DEPO_CONTRACT
            );
            const assetContract = getContractWithSigner(
                ASSET_TOKEN_ADDRESS,
                ASSET_TOKEN_CONTRACT
            );
            await assetContract.approve(
                BOND_DEPO_ADDRESS,
                utils.parseEther(amount.toString())
            );
            const res = await contract.deposit(
                utils.parseEther(amount.toString()),
                account
            );
            await res.wait();
            toast.success("Bond created successfully", toastConfig);
            const coinBalance = await getCoinBalance(account);
            const assetTokenBalance = await getAssetTokenBalance(account);
            const NiitBalance = await getNIITBalance(account);
            setAccountBalance({
                assetTokenBalance,
                coinBalance,
                NiitBalance,
            });
            refreshState();
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const checkExistingBond = async (addr) => {
        try {
            const contract = getContractWithSigner(
                BOND_DEPO_ADDRESS,
                BOND_DEPO_CONTRACT
            );
            const res = await contract.fetchExistingUserBond(addr);
            let str = res.toString();
            str = Number(ethers.utils.formatEther(str));
            setBond(str);
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const checkBondMaturity = async () => {
        try {
            const contract = getContractWithSigner(
                BOND_DEPO_ADDRESS,
                BOND_DEPO_CONTRACT
            );
            const res = await contract.checkMaturity(account);
            setMaturity(res.matured);
            setTimeLeft(Number(res.waitingTimeLeft));
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const stakeBond = async () => {
        try {
            const contract = getContractWithSigner(
                STAKING_ADDRESS,
                STAKING_CONTRACT
            );
            const res = await contract.stakeFromMatureBonds(account);
            await res.wait();
            toast.success("Tokens staked successfully", toastConfig);
            refreshState();
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const stakeTokens = async (amount) => {
        try {
            const contract = getContractWithSigner(
                STAKING_ADDRESS,
                STAKING_CONTRACT
            );
            const niitContract = getContractWithSigner(
                NIIT_ADDRESS,
                NIIT_CONTRACT
            );
            await niitContract.approve(
                STAKING_ADDRESS,
                utils.parseEther(amount)
            );
            const res = await contract.stake(ethers.utils.parseEther(amount));
            await res.wait();
            toast.success("Tokens staked successfully", toastConfig);
            refreshState();
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const withdrawBondTokens = async () => {
        try {
            const contract = getContractWithSigner(
                BOND_DEPO_ADDRESS,
                BOND_DEPO_CONTRACT
            );
            const res = await contract.getTokens();
            await res.wait();
            toast.success("Transaction successfull", toastConfig);
            const coinBalance = await getCoinBalance(account);
            const assetTokenBalance = await getAssetTokenBalance(account);
            const NiitBalance = await getNIITBalance(account);
            setAccountBalance({
                assetTokenBalance,
                coinBalance,
                NiitBalance,
            });
            refreshState();
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const withdrawStakedTokens = async (amount) => {
        try {
            const contract = getContractWithSigner(
                STAKING_ADDRESS,
                STAKING_CONTRACT
            );
            const res = await contract.withdrawStake(
                ethers.utils.parseEther(amount)
            );
            await res.wait();
            toast.success("Transaction successfull", toastConfig);
            const coinBalance = await getCoinBalance(account);
            const assetTokenBalance = await getAssetTokenBalance(account);
            const NiitBalance = await getNIITBalance(account);
            setAccountBalance({
                assetTokenBalance,
                coinBalance,
                NiitBalance,
            });
            refreshState();
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const checkStakingBalance = async (addr) => {
        try {
            const contract = getContractWithSigner(
                STAKING_ADDRESS,
                STAKING_CONTRACT
            );
            const res = await contract.checkStakingBalance(addr);
            let str = res.toString();
            str = Number(ethers.utils.formatEther(str));
            setStakedBalance(str);
        } catch (error) {
            toast.error(
                error ? error.message.slice(0, 73) : "Connection failed",
                toastConfig
            );
            console.error(error.message);
        }
    };
    const value = {
        account,
        connected,
        connectWallet,
        disconnectWallet,
        accountBalance,
        claimFreeTokens,
        bondAST,
        bond,
        checkBondMaturity,
        maturity,
        timeLeft,
        stakeBond,
        withdrawBondTokens,
        staked,
        stakeTokens,
        withdrawStakedTokens,
    };
    return (
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    );
}

export default Web3ContextProvider;
