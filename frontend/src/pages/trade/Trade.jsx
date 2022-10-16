import React from "react";
import { motion } from "framer-motion";

function Trade() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid place-items-center h-screen m-auto w-full"
        >
         <section className="page-content min-w-[50%] max-w-[30rem] text-white flex-center-center">
                   <h2 className="font-bold text-white text-2xl"> Coming soon!</h2>
                </section>
                  </motion.main>
    );
}

export default Trade;
