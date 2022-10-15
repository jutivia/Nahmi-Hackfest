import React from "react";
import { motion } from "framer-motion";

function Trade() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid place-items-center"
        >
            Trade
        </motion.main>
    );
}

export default Trade;
