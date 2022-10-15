import React, { useContext, useEffect, useState } from "react";
import symbol from "../../assets/png/nahmii-logo.png";
import { Web3Context } from "../../contexts/Web3Context";
// import {  utils } from "ethers";
function Balance() {
    const { accountBalance } = useContext(Web3Context);
    const [balance, setBalance] = useState(0);
    const formatBalance = () => {
        const amount = Number(accountBalance.coinBalance);
        setBalance(amount.toFixed(2));
    };
    useEffect(() => {
        formatBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountBalance]);
    return (
        <>
            <div className="flex-center-center gap-x-2 bg-cerulean px-4 py-2 rounded-[10px]">
                <img
                    src={symbol}
                    alt="token symbol"
                    className="aspect-square w-6 bg-richBlack rounded-[50%]"
                />
                <span>{balance || 0} NII</span>
            </div>
        </>
    );
}

export default Balance;
