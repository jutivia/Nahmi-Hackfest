import React, {useState, useEffect, useContext} from "react";
import { Header } from "../../components";
import { Web3Context } from "../../contexts/Web3Context";
import tokenLogo from "../../assets/png/nahmii-logo.png";
const guides = [
    {
        sn: 0,
        header: "Input amount to stake",
        message:
            "Input the desired amount of NIIT tokens you wish to stake from your NIIT wallet balance. You're required to own NIIt to perform this operation",
    },
    {
        sn: 1,
        header: "Approve & confirm transaction",
        message:
            "Grant the protocol approval and confirm the transaction to stake your protocol tokens.",
    },
    {
        sn: 2,
        header: "Receive tokens & accrue interest",
        message:
            "A successful transaction will result in a stake of your tokens at a ROI of 50% annually, accumulated per second after the 7 days wait period",
    },
    {
        sn: 3,
        header: "Withdraw staked tokens with interest",
        message:
            "After staking, you can withdraw your stked tokens at any time, with acumulated interest (interest start counting from 7 days after the last time staked)",
    },
];
function Stake() {
    const [current, setCurrent] = useState(0);
    const [activeLink, setActiveLink] = useState('stake')
    const {  accountBalance, connected, staked, stakeTokens, withdrawStakedTokens } = useContext(Web3Context);
    const [balance, setBalance] = useState(0)
    const activeGuide = guides[current];
    const { sn, header, message } = activeGuide;
    const [withdrawAmount, setWithdrawAmount] = useState(0)
    const [amount, setAmount] = useState(0)
     const formatBalance = ()=> {
            const amount = Number(accountBalance.NiitBalance)
            setBalance(amount.toFixed(2))
        }
        useEffect(()=>{
            formatBalance()
        }, [accountBalance])
         const handleWithdrawInput = (e) =>{
            setWithdrawAmount(e.target.value);
         }
        const handleInput =(e)=>{
        setAmount(e.target.value);
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
                    header="Stake"
                    description="Stake liquidity and assets to earn boosted rewards."
                />
                 <div className=" flex-start-start mt-8 max-w-[40rem] h-auto glass p-8 rounded-tl-2xl rounded-tr-2xl flex-col text-white">
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
                    <h3 className="text-2xl font-bold text-white">Staked Token Balance:  {staked.toFixed(2)} NIIT</h3>
                </div>

            </section>
                
            <section className="page-content flex-center-start gap-y-12 flex-col py-12 w-5/12 text-white">
                <div className="flex-center-start gap-x-8">
                <div className="relative px-4">
                <button className={`font-bold text-left w-full text-1xl mb-4 cursor-pointer transition-all duration-300 outline-0 ${ activeLink === 'stake'
                                    ? "active text-cerulean "
                                    : ""}`} onClick={()=>setActiveLink('stake')}>
                    Stake 
                </button>
                 <span
                     className={`purple-gradient mx-auto absolute bottom-0 left-0 right-0 h-[3px] rounded-tl rounded-tr w-full  ${
                                    activeLink === 'stake' ? "visible" : "invisible"
                                }`}
                ></span>
                </div>
                <div className="relative px-4">
                <button className={`font-bold text-left w-full text-1xl mb-4 cursor-pointer transition-all duration-300 outline-0 ${ activeLink === 'withdraw'
                                    ? "active text-cerulean"
                                    : ""}`} onClick={()=>setActiveLink('withdraw')}>
                    Withdraw 
                </button>
                <span
                     className={`purple-gradient mx-auto absolute bottom-0 left-0 right-0 h-[3px] rounded-tl rounded-tr w-full  ${
                                    activeLink === 'withdraw' ? "visible" : "invisible"
                                }`}
                ></span>
                </div>
                </div>
                
                {activeLink === 'stake' && <div className="w-full p-2">
                     <div className="w-full grid gap-y-4">
                    <div className="flex-center-between ">
                        <div className="flex-center-between w-full">
                            <p className="font-bold">NIIT Balance <span className="text-xs font-thin"> (in wallet)  </span>:  { balance}</p>
                            <button className="btn-no-fill" onClick={()=>{setAmount(balance);}}>Max</button>
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
                        />
                        <span className="bg-white flex-center-start gap-x-2 w-8 rounded-2xl ml-4 absolute hover:opacity-50">
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
                <div className="flex-center-center mt-8">
                {(Number(amount) <= Number(balance) && Number(amount) >0 && connected && balance > 0) && <button className="btn-no-fill mx-auto" onClick={()=>{stakeTokens(amount); setAmount(0)}}>Confirm</button>}
                {( Number(amount) > Number(balance) || amount == 0 || !connected  && balance == 0) && <button className="btn-no-fill cursor-not-allowed" >Confirm </button>}
                </div>
                </div>}
                {activeLink === 'withdraw' && <div className="w-full p-2">
                     <div className="w-full grid gap-y-4">
                    <div className="flex-center-between ">
                        <div className="flex-center-between w-full">
                            <p className="font-bold">Staked NIIT Balance:  { staked.toFixed(2)}</p>
                            <button className="btn-no-fill" onClick={()=>{setWithdrawAmount(staked);}}>Max</button>
                        </div>
                    </div>
                    <div className="relative flex-center-between">
                        <input
                            type="number"
                            placeholder="0.00"
                            name="amount-in"
                            value={withdrawAmount}
                            onChange={handleWithdrawInput}
                            className="input-field py-8"
                        />
                        <span className="bg-white flex-center-start gap-x-2 w-8 rounded-2xl ml-4 absolute hover:opacity-50">
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
                <div className="flex-center-center mt-8">
                {(Number(withdrawAmount) <= Number(staked) && Number(withdrawAmount) >0 && connected && staked > 0) && <button className="btn-no-fill mx-auto" onClick={()=>{withdrawStakedTokens(amount); setWithdrawAmount(0)}}>Confirm</button>}
                {( Number(withdrawAmount) > Number(staked) || withdrawAmount == 0 || !connected  && staked == 0) && <button className="btn-no-fill cursor-not-allowed" >Confirm </button>}
                </div>
                </div>}
             
            </section>
        </main>
    );
}

export default Stake;
