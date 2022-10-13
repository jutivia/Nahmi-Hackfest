import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Dashboard, Bond, Stake, Trade, Error, Layout } from "pages";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import "./App.css";

const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
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
