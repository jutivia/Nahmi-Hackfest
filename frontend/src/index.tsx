import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { WagmiConfig, createClient , chain} from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const alchemyId = process.env.ALCHEMY_ID;

const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.rinkeby, chain.goerli, chain.optimismKovan, chain.kovan];

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
