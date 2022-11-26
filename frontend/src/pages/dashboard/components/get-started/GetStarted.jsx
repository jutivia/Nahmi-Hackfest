import React, { useContext } from "react";
import { Web3Context } from "../../../../contexts/Web3Context";

function GetStarted() {
    const { connectWallet } = useContext(Web3Context);
    return (
        <section className="glass rounded-3xl p-8 min-w-[50%] max-w-[30rem] flex-center-center text-center flex-col gap-y-8 text-white">
            <h2 className="text-xl text-white">
                Bond your assets at a discount and earn NIIT tokens
            </h2>

            <button className="btn-no-fill" onClick={connectWallet}>
                Get Started
            </button>
        </section>
    );
}

export default GetStarted;
