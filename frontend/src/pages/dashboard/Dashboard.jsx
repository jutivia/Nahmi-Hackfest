import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { shortenAddress } from "../../utils/helper/shortenAddress";
import { Web3Context } from "../../contexts/Web3Context";
import symbol from "../../assets/png/nahmii-logo.png";
import GetStarted from "./components/get-started/GetStarted";
function Dashboard() {
    const {
        connected,
        account,
        accountBalance,
        disconnectWallet,
        bond,
        staked,
    } = useContext(Web3Context);
    const connectedAccount = shortenAddress(account);
    const tokens = [
        {
            symbol: "NII",
            image: symbol,
            balance: Number(accountBalance.coinBalance).toFixed(2) || 0,
        },
        {
            symbol: "AST",
            image: symbol,
            balance: Number(accountBalance.assetTokenBalance).toFixed(2) || 0,
        },
    ];

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid place-items-center h-screen m-auto w-full"
        >
            {connected ? (
                <section className="page-content min-w-[50%] max-w-[30rem] text-white">
                    <div className="flex-center-between w-full">
                        <div className="flex-center-start gap-x-4 ">
                            <FaWallet className="inline aspect-square text-5xl text-cerulean" />
                            <p className="text-white text-xl font-[500]">
                                {connectedAccount}
                            </p>
                        </div>
                        <button
                            className="btn-filled px-4 py-2 font-[500]"
                            onClick={disconnectWallet}
                        >
                            Disconnect
                        </button>
                    </div>
                    <ul className="grid h-[80%] content-center grid-flow-row grid-cols-3 gap-x-4">
                        <li className="dashboard-card">
                            <h3 className="dashboard-card-header text-left font-bold">Tokens</h3>
                            {tokens.map((token) => (
                                <p key={token.symbol}>
                                    <span>{token.balance} </span>
                                    {token.symbol}
                                </p>
                            ))}
                        </li>
                        <li className="dashboard-card">
                            <h3 className="dashboard-card-header text-left font-bold">
                                Bonded Assets
                            </h3>
                            <p>
                                <span>{bond.toFixed(2) || 0} </span>
                                NIIT
                            </p>
                        </li>
                        <li className="dashboard-card">
                            <h3 className="dashboard-card-header text-left font-bold">
                                Staked Assets
                            </h3>
                            <p>
                                <span>{staked.toFixed(2) || 0} </span>
                                NIIT
                            </p>
                        </li>
                    </ul>
                </section>
            ) : (
                <GetStarted />
            )}
        </motion.main>
    );
}

export default Dashboard;
