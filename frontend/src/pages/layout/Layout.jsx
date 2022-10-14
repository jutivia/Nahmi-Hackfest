import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "../../components";
import Web3Context from "../../contexts/Web3Context";

const Layout = () => {
    const value = useContext(Web3Context);
    console.log("layout value: ", value);
    return (
        <main>
            <Navbar />
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-[90vh] w-full background flex-start-start flex-col"
            >
                <Outlet />
                <ToastContainer />
            </motion.section>
        </main>
    );
};

export default Layout;
