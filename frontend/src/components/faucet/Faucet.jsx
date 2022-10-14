import React, {useContext} from "react";
import {Web3Context} from '../../contexts/Web3Context'

function Faucet() {
    const {claimFreeTokens} = useContext(Web3Context);
    return <button className="btn-filled px-4 py-2" onClick={claimFreeTokens}>Mint Asset Tokens</button>;
}

export default Faucet;
