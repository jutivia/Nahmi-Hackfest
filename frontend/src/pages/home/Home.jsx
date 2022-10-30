import React from "react";
import { motion } from "framer-motion";
import BenefitCard from "../../components/benefit-card/BenefitCard";

const benefits = [
    {
        title: "Get tokens at a discount",
        description:
            "Bond your assets by exchanging them for the Zeus Protocol's governance tokens (ZEUS) at a discounted rate",
    },
    {
        title: "No exposure to impermanent loss",
        description:
            "Bond your assets by exchanging them for the Zeus Protocol's governance tokens (ZEUS) at a discounted rate",
    },
    {
        title: "Get tokens at a discount",
        description:
            "Bond your assets by exchanging them for the Zeus Protocol's governance tokens (ZEUS) at a discounted rate",
    },
    {
        title: "Get tokens at a discount",
        description:
            "Bond your assets by exchanging them for the Zeus Protocol's governance tokens (ZEUS) at a discounted rate",
    },
];
function Home() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full p-4 sm:p-8"
        >
            <h1 className="font-black gradient-text text-center pt-4 md:pt-8 zeus-text">
                ZEUS PROTOCOL
            </h1>
            <p className="text-white text-center font-[500] sub-heading">
                Bond, Stake, Earn, Trade
            </p>

            <section className="flex-center-center sm:items-start flex-col sm:flex-row flex-wrap gap-4 mt-4 md:mt-8  mx-auto">
                {benefits.map((benefit, index) => (
                    <BenefitCard key={index} benefit={benefit} />
                ))}
            </section>
        </motion.main>
    );
}

export default Home;
