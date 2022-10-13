import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "components";
const Layout = (): JSX.Element => {
    return (
        <main>
            <Navbar />
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-[90vh] background flex-center-center flex-col"
            >
                <Outlet />
            </motion.section>
        </main>
    );
};

export default Layout;
