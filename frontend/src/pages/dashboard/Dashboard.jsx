import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { shortenAddress } from "../../utils/helper/shortenAddress";
import { Web3Context } from "../../contexts/Web3Context";
import nahmiiLogo from "../../assets/png/nahmii-logo.png";
import GetStarted from "./components/get-started/GetStarted";
import AssetCard from "./components/asset-card/AssetCard";
import DisconnectWallet from "../../components/buttons/disconnect-wallet/DisconnectWallet";

function Dashboard() {
    const { connected, account, accountBalance, bond, staked } =
        useContext(Web3Context);
    const connectedAccount = shortenAddress(account);
    const assets = [
        {
            title: "Wallet",
            tokens: [
                {
                    symbol: "NII",
                    image: nahmiiLogo,
                    balance: Number(accountBalance.coinBalance).toFixed(2) || 0,
                },
                {
                    symbol: "NIIT",
                    image: nahmiiLogo,
                    balance: Number(accountBalance.NiitBalance).toFixed(2) || 0,
                },
                {
                    symbol: "AST",
                    image: nahmiiLogo,
                    balance:
                        Number(accountBalance.assetTokenBalance).toFixed(2) ||
                        0,
                },
            ],
        },
        {
            title: "Bond",
            tokens: [
                {
                    symbol: "NII",
                    image: nahmiiLogo,
                    balance: bond.toFixed(2) || 0,
                },
            ],
        },
        {
            title: "Stake",
            tokens: [
                {
                    symbol: "NII",
                    image: nahmiiLogo,
                    balance: staked.toFixed(2) || 0,
                },
            ],
        },
    ];
    const [activeAsset, setActiveAsset] = useState(assets[0]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 w-full translate-x-[-50%] translate-y-[-50%] flex-start-center px-4 sm:px-8"
        >
            {connected ? (
                <section className="glass p-8 min-h-[27.5rem] rounded-xl max-w-[50rem]  text-white mx-auto w-full">
                    <div className="flex items-center justify-center lg:justify-between w-full">
                        <div className="flex-center-start gap-x-4 ">
                            <FaWallet className="inline aspect-square text-3xl sm:text-5xl text-cerulean" />
                            <p className="text-white text-xl font-[500]">
                                {connectedAccount}
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <DisconnectWallet />
                        </div>
                    </div>

                    <div className="flex-center-center text-center gap-x-4 sm:gap-x-8 mb-8 sm:mb-8 w-full">
                        {assets.map((asset, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveAsset(assets[index])}
                                className={`nav-link block leading-[4] relative px-4 transition-[width] duration-300 outline-0  font-bold  ${
                                    activeAsset.title === asset.title
                                        ? "active text-cerulean"
                                        : "text-white"
                                }`}
                            >
                                {asset.title}
                                <span
                                    className={`purple-gradient mx-auto absolute bottom-0 left-0 right-0 h-[3px] rounded-tl rounded-tr w-0  ${
                                        activeAsset.title === asset.title
                                            ? "w-full"
                                            : ""
                                    }`}
                                ></span>
                            </button>
                        ))}
                    </div>
                    <div className="w-full flex-start-center  mx-auto">
                        <AssetCard asset={activeAsset} />
                    </div>
                </section>
            ) : (
                <GetStarted />
            )}
        </motion.main>
    );
}

export default Dashboard;
