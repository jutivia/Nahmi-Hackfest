import React, { useContext } from "react";
import { FaWallet } from "react-icons/fa";
import { shortenAddress } from "../../utils/helper/shortenAddress";
import { Web3Context } from "../../contexts/Web3Context";
import symbol from "../../assets/png/nahmii-logo.png";
import GetStarted from "./components/get-started/GetStarted";
const tokens = [
    {
        symbol: "NII",
        image: symbol,
        balance: 4.5,
    },
];
function Dashboard() {
    const { connected, account, disconnectWallet } = useContext(Web3Context);
    const connectedAccount = shortenAddress(account);
    return (
        <main className="grid place-items-center h-screen m-auto w-full">
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
                            <h3 className="dashboard-card-header">Tokens</h3>
                            {tokens.map((token) => (
                                <p key={token.symbol}>
                                    <span>{token.balance} </span>
                                    {token.symbol}
                                </p>
                            ))}
                        </li>
                        <li className="dashboard-card">
                            <h3 className="dashboard-card-header">
                                Bound Assets
                            </h3>
                            {tokens.map((token) => (
                                <p key={token.symbol}>
                                    <span>{token.balance} </span>
                                    {token.symbol}
                                </p>
                            ))}
                        </li>
                        <li className="dashboard-card">
                            <h3 className="dashboard-card-header">
                                Staked Assets
                            </h3>
                            {tokens.map((token) => (
                                <p key={token.symbol}>
                                    <span>{token.balance} </span>
                                    {token.symbol}
                                </p>
                            ))}
                        </li>
                    </ul>
                </section>
            ) : (
                <GetStarted />
            )}
        </main>
    );
}

export default Dashboard;
