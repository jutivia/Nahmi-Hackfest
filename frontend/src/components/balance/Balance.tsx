import React, {useState, useEffect, useContext} from "react";
import {AppContext} from 'contexts'
import symbol from "assets/png/nahmii-logo.png";
import ethers from 'ethers';

function Balance(): JSX.Element {
    const {currentAccount, provider} = useContext(AppContext);
    console.log(currentAccount)
    useEffect( ()=>{
        const init = async() => {
            setBalance(await provider.getBalance(currentAccount.address));
        }
        init();
    }, [currentAccount])
    const [balance, setBalance] = useState<number>(0.0)
    return (
        <button className="flex-center-center gap-x-2 bg-cerulean px-4 py-2 rounded-[10px]">
            <img
                src={symbol}
                alt="token symbol"
                className="aspect-square w-6 bg-richBlack rounded-[50%]"
            />
            <span>{balance} NII</span>
        </button>
    );
}

export default Balance;
