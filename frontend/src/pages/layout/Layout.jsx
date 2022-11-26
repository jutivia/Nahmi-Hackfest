import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "../../components";
import bg from "../../assets/png/dots-purple.png";

const Layout = () => {
    return (
        <main
            className="max-w-[1440px] mx-auto"
            style={{
                // backgroundImage: `url(${bg})`,
                // backgroundPosition: "center-bottom",
                // backgroundSize: "35%",
                background: `rgba(0,0,0,0.5) no-repeat center`,
                // background: `rgba(0,0,0,0.5) url(${bg}) no-repeat center`,
                // backgroundRepeat: "no-repeat",
            }}
        >
            <Navbar />
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-[90vh] w-full flex-start-start flex-col"
            >
                <Outlet />
                <ToastContainer />
            </motion.section>
        </main>
    );
};

export default Layout;
