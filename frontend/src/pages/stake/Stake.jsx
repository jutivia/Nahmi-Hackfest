import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Header } from "../../components";
import { Web3Context } from "../../contexts/Web3Context";
import tokenLogo from "../../assets/png/nahmii-logo.png";
const guides = [
    {
        sn: 0,
        header: "Input amount to stake",
        message:
            "Input the desired amount of NIIT tokens you wish to stake from your NIIT wallet balance. You're required to own NIIT to perform this operation",
    },
    {
        sn: 1,
        header: "Approve & confirm transaction",
        message:
            "Grant the protocol approval and confirm the transaction to stake your NIIT tokens.",
    },
    {
        sn: 2,
        header: "Receive tokens & accrue interest",
        message:
            "A successful transaction will result in a stake of your tokens with 50% annual percentage yield, compounded per second after the 7 days wait period",
    },
    {
        sn: 3,
        header: "Withdraw staked tokens with interest",
        message:
            "After staking, you can withdraw your staked tokens at any time, with accumulated interest (interest begin to accrue 7 days after the last stake)",
    },
];
function Stake() {
    const [current, setCurrent] = useState(0);
    const [activeLink, setActiveLink] = useState("stake");
    const {
        accountBalance,
        connected,
        connectWallet,
        staked,
        stakeTokens,
        withdrawStakedTokens,
    } = useContext(Web3Context);
    const [balance, setBalance] = useState(0);
    const activeGuide = guides[current];
    const { sn, header, message } = activeGuide;
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [amount, setAmount] = useState(0);
    const validStake =
        Number(amount) <= Number(balance) &&
        Number(amount) > 0 &&
        connected &&
        balance > 0;
    const validWithdrawal =
        Number(withdrawAmount) <= Number(staked) &&
        Number(withdrawAmount) > 0 &&
        connected &&
        staked > 0;
    const formatBalance = () => {
        const amount = Number(accountBalance.NiitBalance);
        setBalance(amount.toFixed(2) || 0);
    };
    useEffect(() => {
        formatBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountBalance]);
    const handleWithdrawInput = (e) => {
        setWithdrawAmount(e.target.value);
    };
    const handleInput = (e) => {
        setAmount(e.target.value);
    };

    const onStake = () => {
        if (validStake) {
            stakeTokens(amount);
            setAmount("");
        }
        // if (!connected) {
        //     connectWallet();
        // }
    };
    const onWithdraw = () => {
        if (validWithdrawal) {
            withdrawStakedTokens(amount);
            setWithdrawAmount("");
        }
        // if (!connected) {
        //     connectWallet();
        // }
    };

    useEffect(() => {
        const nextSlide = () =>
            setCurrent((current) => (current + 1) % guides.length);
        const next = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(next);
    }, [current]);
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-center-evenly px-[5%] h-full w-full"
        >
            <section>
                <Header
                    header="Stake"
                    description="Stake liquidity and assets to earn boosted rewards."
                />
                <div className=" flex-start-start mt-8 max-w-[40rem] h-36 glass p-8 rounded-tl-2xl rounded-tr-2xl flex-col text-white">
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
                {connected && (
                    <div className="flex-center-between gap-x-5 my-5">
                        <h3 className="text-2xl font-bold text-white">
                            Stake Balance: {staked.toFixed(2) || 0} NIIT
                        </h3>
                    </div>
                )}
            </section>

            <section className="page-content flex-center-start gap-y-12 flex-col py-12 w-5/12 text-white">
                <div className="flex-center-start gap-x-8">
                    <div className="relative px-4">
                        <button
                            className={`font-bold text-left w-full text-xl mb-4 transition-all duration-300 outline-0 ${
                                activeLink === "stake"
                                    ? "active text-cerulean "
                                    : ""
                            }`}
                            onClick={() => setActiveLink("stake")}
                        >
                            Stake
                        </button>
                        <span
                            className={`purple-gradient mx-auto absolute bottom-0 left-0 right-0 h-[3px] rounded-tl rounded-tr w-full  ${
                                activeLink === "stake" ? "visible" : "invisible"
                            }`}
                        ></span>
                    </div>
                    <div className="relative px-4">
                        <button
                            className={`font-bold text-left w-full text-xl mb-4 transition-all duration-300 outline-0 ${
                                activeLink === "withdraw"
                                    ? "active text-cerulean"
                                    : ""
                            }`}
                            onClick={() => setActiveLink("withdraw")}
                        >
                            Withdraw
                        </button>
                        <span
                            className={`purple-gradient mx-auto absolute bottom-0 left-0 right-0 h-[3px] rounded-tl rounded-tr w-full  ${
                                activeLink === "withdraw"
                                    ? "visible"
                                    : "invisible"
                            }`}
                        ></span>
                    </div>
                </div>

                {activeLink === "stake" && (
                    <div className="w-full p-2">
                        <div className="w-full grid gap-y-4">
                            <div className="flex-center-between ">
                                <div className="flex-center-between w-full">
                                    <p className="font-bold">
                                        NIIT Balance{" "}
                                        <span className="text-xs font-thin">
                                            {" "}
                                            (in wallet){" "}
                                        </span>
                                        : {connected ? balance : "0.00"}
                                    </p>
                                    <button
                                        className="btn-no-fill"
                                        onClick={() => {
                                            connected && setAmount(balance);
                                        }}
                                    >
                                        Max
                                    </button>
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
                                    />
                                    NIIT
                                </span>
                            </div>
                        </div>
                        <div className="flex-center-center mt-8">
                            <button
                                className={`btn-no-fill ${validStake? '': 'disabled' }`}
                                onClick={onStake}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}
                {activeLink === "withdraw" && (
                    <div className="w-full p-2">
                        <div className="w-full grid gap-y-4">
                            <div className="flex-center-between ">
                                <div className="flex-center-between w-full">
                                    <p className="font-bold">
                                        Staked NIIT Balance:{" "}
                                        {connected ? staked.toFixed(2) : "0.00"}
                                    </p>
                                    <button
                                        className="btn-no-fill"
                                        onClick={() => {
                                            connected &&
                                                setWithdrawAmount(staked);
                                        }}
                                    >
                                        Max
                                    </button>
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
                                    />
                                    NIIT
                                </span>
                            </div>
                        </div>
                        <div className="flex-center-center mt-8">
                            <button
                                className={`btn-no-fill ${validWithdrawal? '': 'disabled' }`}
                                onClick={onWithdraw}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </motion.main>
    );
}

export default Stake;
