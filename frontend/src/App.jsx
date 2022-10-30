import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Dashboard, Bond, Stake, Trade, Error, Layout } from "./pages";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
    return (
        <AnimatePresence mode="wait">
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/bond" element={<Bond />} />
                        <Route path="/stake" element={<Stake />} />
                        <Route path="/trade" element={<Trade />} />
                    </Route>
                    <Route path="*" element={<Error />} />
                </Routes>
            </Router>
        </AnimatePresence>
    );
}

export default App;
