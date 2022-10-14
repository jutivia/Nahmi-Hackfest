import React, { useEffect, useState, useContext } from "react";
import { Header } from "../../components";
import tokenLogo from "../../assets/png/nahmii-logo.png";
import { Web3Context } from "../../contexts/Web3Context";

const guides = [
    {
        sn: 0,
        header: "Pick asset to bond",
        message:
            "Select an asset to bond and swap for the Nahmii protocol token.",
    },
    {
        sn: 1,
        header: "Input desired amount",
        message: "Input the desired amount of assets to bond.",
    },
    {
        sn: 2,
        header: "Approve & confirm transaction",
        message:
            "Grant the protocol approval and confirm the transaction to bond your assets.",
    },
    {
        sn: 3,
        header: "Receive tokens & accrue interest",
        message:
            "A successful transaction will result in an exchange of your assets for the protocol token at a 4% discount.",
    },
];
function Bond() {
    const [current, setCurrent] = useState(0);
    const [amount, setAmount] = useState(0)
    const [NiiTAmount, setNiiTAmount] = useState(0)
    const [bondToken, setBond] = useState(0)
    const activeGuide = guides[current];
    const { sn, header, message } = activeGuide;
    const {  accountBalance, connected, bondAST, bond, checkBondMaturity, maturity, timeLeft } = useContext(Web3Context);
    const [balance, setBalance] = useState(0)
    const [showText, setShowText] = useState(false)
    const [mature, setMature] = useState(false)
    const [countdown, setCountdown] = useState(0)
    // console.log(bond)
    const formatBalance = ()=> {
            const amount = Number(accountBalance.assetTokenBalance)
            setBalance(amount.toFixed(2))
        }
        useEffect(()=>{
            formatBalance()
        }, [accountBalance])

        useEffect(()=>{
             setBond(bond.toFixed(2))
        }, [bond])

        
        const checkMaturity = ()=>{
            checkBondMaturity()
             setShowText(true)
             setMature(maturity)
            setCountdown(timeLeft)
        }

    const handleInput =(e:any):void=>{
        setAmount(e.target.value);
        convertToNiit(e.target.value);

    }
    const convertToNiit = (num)=>{
        const init= num/20
        setNiiTAmount(init + (init * 0.04))
    }
    useEffect(() => {
        const nextSlide = () =>
            setCurrent((current) => (current + 1) % guides.length);
        const next = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(next);
    }, [current]);
    return (
        <main className="flex-center-between px-[5%] h-full w-full gap-x-20">
            <section>
                <Header
                    header="Bond"
                    description=" Bond your assets and earn Nahmii DAO tokens at a discount."
                />

                <div className=" flex-start-start mt-8 max-w-[40rem] h-28 glass p-8 rounded-tl-2xl rounded-tr-2xl flex-col text-white">
                    <div className="flex-center-start gap-x-4 mb-2">
                        <span className="text-cerulean font-bold">{`${sn + 1}/${
                            guides.length
                        }`}</span>
                        <h2 className=" font-bold capitalize">{header}</h2>
                    </div>
                    <p>{message}</p>
                </div>
                <div className="flex-center-center max-w-[40rem] gap-x-8 glass bg-richBlack rounded-br-2xl rounded-bl-2xl p-8">
                    {guides.map((guide) => (
                        <span
                            key={guide.sn}
                            onClick={() => setCurrent(guide.sn)}
                            className={`h-[5px] rounded-2xl w-32 bg-greenBlue transition duration-300 ease-in-out ${
                                current === guide.sn
                                    ? "active-guide purple-gradient"
                                    : ""
                            }`}
                        ></span>
                    ))}
                </div>
                <div className="flex-center-between gap-x-5 my-5">
                    <h3 className="text-2xl text-white">Tokens Bounded: {bondToken} NIIT</h3>
                    {!mature && <button className="btn-no-fill" onClick={checkMaturity}>Check maturity</button>}
                </div>
               {showText && <div>
                    {!mature && <h4 className="text-cerulean font-bold text-2xl my-2"> Your tokens are still brewing! They would be available for use in {countdown} seconds</h4>}
                    {mature && <div>
                        <h4 className="text-cerulean font-bold text-2xl my-2"> Tokens are mature, and ready for use!</h4>
                        <div className="flex-center-center gap-x-10"><button className="btn-no-fill bg-white"> Stake Tokens</button> <button className="btn-no-fill bg-cerulean text-white">Withdraw Tokens </button></div>
                        </div>}
                </div>}
            </section>

            <section className="page-content flex-center-between flex-col py-12 w-5/12 text-white">
                <h2 className="font-bold text-left w-full text-2xl mb-4">
                    Bond Asset
                </h2>
                <div className="w-full grid gap-y-4">
                    <div className="flex-center-between ">
                        <h3>You give</h3>
                        <div className="flex-center-between gap-x-8 ">
                            <p>Balance: {balance} AST</p>
                            <button className="btn-no-fill" onClick={()=>{setAmount(balance); convertToNiit(balance)}}>Max</button>
                        </div>
                    </div>
                    <div className="relative flex-center-between">
                        <input
                            type="number"
                            placeholder="0.00"
                            name="amount-in"
                            value={amount}
                            onChange={handleInput}
                            className="input-field py-8"
                            max="1000"
                        />
                        <span className="bg-white flex-center-start gap-x-2 w-8 rounded-2xl ml-4 absolute hover:opacity-50">
                            <img
                                src={tokenLogo}
                                alt="AST"
                                className="aspect-square"
                                // onClick={expandSearchField}
                            />
                            AST
                        </span>
                    </div>
                </div>
                <div className="w-full grid gap-y-4">
                    <div>
                        <h3>You get</h3>
                    </div>
                    <div className="relative flex-center-between">
                        <input
                            type="number"
                            placeholder="0.00"
                            name="amount-out"
                            // onChange={handleInput}
                            value={NiiTAmount}
                            className="input-field py-8"
                            readOnly
                        />
                        <span className="bg-richBlack flex-center-start gap-x-2 w-8 rounded-2xl ml-4 absolute hover:opacity-50">
                            <img
                                src={tokenLogo}
                                alt="NIIT"
                                className="aspect-square"
                                // onClick={expandSearchField}
                            />
                            NIIT
                        </span>
                    </div>
                </div>
               {(Number(amount) <= Number(balance) && amount && connected) && <button className="btn-no-fill" onClick={()=>{bondAST(amount); setAmount(0); setNiiTAmount(0)}}>Confirm</button>}
                {( Number(amount) > Number(balance) || !amount || !connected ) && <button className="btn-no-fill cursor-not-allowed" >Confirm </button>}
            </section>
        </main>
    );
}

export default Bond;
