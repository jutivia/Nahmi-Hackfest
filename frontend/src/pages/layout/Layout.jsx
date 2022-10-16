import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "../../components";

const Layout = () => {
    return (
        <main className="max-w-[1440px] mx-auto">
            <Navbar />
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-[90vh] w-full flex-start-start flex-col"
            >
                <Outlet />
                <ToastContainer />
            </motion.section>
        </main>
    );
};

export default Layout;
