import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Header } from "../../components";
import tokenLogo from "../../assets/png/nahmii-logo.png";
import { Web3Context } from "../../contexts/Web3Context";
import { toast } from "react-toastify";
const toastConfig = { autoClose: 5000, theme: "dark", position: "bottom-left" };

const guides = [
    {
        sn: 0,
        header: "Pick asset to bond",
        message: "Mint the test asset tokens from the protocol's AST faucet.",
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
            "A successful transaction will result in an exchange of your assets for the protocol token at a 4% discount after a 7 days maturity period.",
    },
];
function Bond() {
    const [current, setCurrent] = useState(0);
    const [amount, setAmount] = useState("");
    const [NiiTAmount, setNiiTAmount] = useState("");
    const [bondToken, setBond] = useState(0);
    const activeGuide = guides[current];
    const[showError, setShowError] = useState(false)
    const [error, setError] = useState('')
    const { sn, header, message } = activeGuide;
    const {
        accountBalance,
        connected,
        bondAST,
        bond,
        checkBondMaturity,
        maturity,
        timeLeft,
        stakeBond,
        withdrawBondTokens,
    } = useContext(Web3Context);
    const [balance, setBalance] = useState(0);
    const [showText, setShowText] = useState(false);
    const [mature, setMature] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [time, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        munites: 0,
        seconds: 0,
    });
    const validInput =
        Number(amount) <= Number(balance) && amount > 0 && connected;
    const calcTimeLeft = (b) => {
        let a = b;

        let days = Math.floor(a / (3600 * 24));
        a -= days * 3600 * 24;
        let hours = Math.floor(a / 3600);
        a -= hours * 3600;
        let minutes = Math.floor(a / 60);
        a -= minutes * 60;
        let time = {
            days,
            hours,
            minutes,
            seconds: a,
        };
        return time;
    };

    useEffect(() => {
        if (countdown > 0) {
            setTimeLeft(calcTimeLeft(countdown));
        }
        const count = setTimeout(() => {
            setCountdown((countdown) => countdown - 1);
        }, 1000);
        return () => clearTimeout(count);
    }, [countdown]);

    const formatBalance = () => {
        const amount = Number(accountBalance.assetTokenBalance);
        setBalance(amount.toFixed(2) || 0);
    };
    useEffect(() => {
        formatBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountBalance]);

    useEffect(() => {
        setBond(bond.toFixed(2));
    }, [bond]);

    const checkMaturity = () => {
        checkBondMaturity();
        setShowText(true);
        setMature(maturity);
    };
    useEffect(() => {
        setCountdown(timeLeft);
    }, [timeLeft]);

    const handleInput = (e) => {
        setAmount(e.target.value);
        convertToNiit(e.target.value);
    };
    const convertToNiit = (num) => {
        const init = num / 20;
        setNiiTAmount(init + init * 0.04);
    };
    useEffect(() => {
        const nextSlide = () =>
            setCurrent((current) => (current + 1) % guides.length);
        const next = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(next);
    }, [current]);

    const handleBondAsset = () => {
        if (validInput) {
            bondAST(amount);
            setAmount("");
            setNiiTAmount("");
        }else if(!validInput && connected) {
            setError("Invalid AST amount");
            setShowError(true)
            setTimeout(()=>{
                setShowError(false)
            }, 2000)
        } else if (!connected) {
           toast.error("Connect your wallet to activate button", toastConfig);
        }
    };

    const setMax = () => {
        if (connected) {
            setAmount(balance);
            convertToNiit(balance);
        }
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-center-evenly px-[5%] h-full w-full "
        >
            <section>
                <Header
                    header="Bond"
                    description=" Bond your assets and earn NIIT tokens at a discount."
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
                {connected && (
                    <section>
                        <div className="flex-center-between gap-x-5 my-5">
                            <h3 className="text-2xl font-bold text-white">
                                Bonded Assets: {bondToken} NIIT
                            </h3>
                            {!showText && bondToken > 0 && (
                                <button
                                    className="btn-no-fill"
                                    onClick={checkMaturity}
                                >
                                    Check maturity
                                </button>
                            )}
                        </div>
                        {showText && (
                            <div>
                                {!mature && (
                                    <>
                                        <h4 className="text-cerulean text-2xl my-2 max-w-2xl font-bold">
                                            {" "}
                                            Your tokens are still brewing!
                                        </h4>
                                        <p className="text-white text-1xl my-2 max-w-2xl">
                                            {" "}
                                            Tokens will be available for use in{" "}
                                            <span className="font-bold">
                                                {time.days} days, {time.hours}{" "}
                                                hours, {time.minutes} minutes
                                                and {time.seconds} seconds
                                            </span>
                                        </p>
                                    </>
                                )}
                                {mature && (
                                    <div>
                                        <h4 className="text-cerulean font-bold text-2xl my-2">
                                            {" "}
                                            Tokens are mature, and ready for
                                            use!
                                        </h4>
                                        <div className="flex-center-center gap-x-10">
                                            <button
                                                className="btn-no-fill bg-white"
                                                onClick={stakeBond}
                                            >
                                                {" "}
                                                Stake Tokens
                                            </button>{" "}
                                            <button
                                                className="btn-no-fill bg-cerulean text-white"
                                                onClick={withdrawBondTokens}
                                            >
                                                Withdraw Tokens{" "}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}
            </section>

            <section className="page-content flex-center-between flex-col py-12 w-5/12 text-white">
                <h2 className="font-bold text-left w-full text-cerulean text-xl mb-4">
                    Bond Asset
                </h2>
                <div className="w-full grid gap-y-4">
                    <div className="flex-center-between ">
                        <h3>You give</h3>
                        <div className="flex-center-between gap-x-8 ">
                            <p>
                                Balance: {connected ? balance || 0 : "0.00"} AST
                            </p>
                            <button className="btn-no-fill" onClick={setMax}>
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
                                alt="AST"
                                className="aspect-square"
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
                            />
                            NIIT
                        </span>
                    </div>
                    {showError && <p className="text-red"> {error}</p> }
                </div>

                <button
                    className={`btn-no-fill ${validInput ? "" : "disabled"}`}
                    onClick={handleBondAsset}
                >
                    Confirm
                </button>
            </section>
        </motion.main>
    );
}

export default Bond;
