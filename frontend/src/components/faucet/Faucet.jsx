import React, {useContext, useState} from "react";
import {Web3Context} from '../../contexts/Web3Context'

function Faucet() {
    const {claimFreeTokens} = useContext(Web3Context);
    const [showSpan, setShowSpan] = useState(false)
    return (<div className="relative">
    <button className="btn-filled px-4 py-2" onClick={claimFreeTokens} onMouseOver={()=>setShowSpan(true)} onMouseLeave={()=>setShowSpan(false)}>AST Faucet</button>
    {showSpan && <span className="absolute top-[120%] left-[-20%] text-center glass px-4 py-2 w-[15rem] text-gray-50"> Mint 1000 AST tokens for bonding</span>}
    </div>);

}

export default Faucet;
