import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Web3ContextProvider from "./contexts/Web3Context";
import MenuContextProvider from "./contexts/MenuContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <Web3ContextProvider>
                <MenuContextProvider>
                    <App />
                </MenuContextProvider>
            </Web3ContextProvider>
        </Router>
    </React.StrictMode>
);

reportWebVitals();
