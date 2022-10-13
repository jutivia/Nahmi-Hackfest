import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Dashboard, Bond, Stake, Trade, Error, Layout } from "pages";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import "./App.css";
import {
    WagmiConfig,
    createClient,
    defaultChains,
    configureChains,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
    alchemyProvider({ apiKey: "yourAlchemyApiKey" }),
    publicProvider(),
]);

const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: "wagmi",
            },
        }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: "Injected",
                shimDisconnect: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
});

function App(): JSX.Element {
    return (
        <WagmiConfig client={client}>
            <AnimatePresence mode="wait">
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="/bond" element={<Bond />} />
                            <Route path="/stake" element={<Stake />} />
                            <Route path="/trade" element={<Trade />} />
                        </Route>
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Router>
            </AnimatePresence>
        </WagmiConfig>
    );
}

export default App;
