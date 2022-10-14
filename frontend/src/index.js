import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Web3ContextProvider from "./contexts/Web3Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Web3ContextProvider>
            <App />
        </Web3ContextProvider>
    </React.StrictMode>
);

reportWebVitals();
