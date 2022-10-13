import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ConnectKitProvider, getDefaultClient } from "connectkit";

import { WagmiConfig, createClient, chain, configureChains } from "wagmi";




import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const alchemyId = process.env.ALCHEMY_ID;

const avalancheChain = {
  id: 43_114,
  name: "Avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
    snowtrace: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};

const { chains } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    alchemyProvider({ apiKey: alchemyId }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== avalancheChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ],
);


const client = createClient(
    
  getDefaultClient({
    appName: "Your App Name",
    alchemyId,
    chains,
   
  }),
);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
       <WagmiConfig client={client}>
            <ConnectKitProvider theme='auto' mode='dark'>
        <App />
        </ConnectKitProvider>
        </WagmiConfig>
    </React.StrictMode>
);

reportWebVitals();
