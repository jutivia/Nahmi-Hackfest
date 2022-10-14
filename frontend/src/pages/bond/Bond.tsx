import React, { useEffect, useState } from "react";
import { Header } from "components";
import tokenLogo from "assets/png/nahmii-logo.png";
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
function Bond(): JSX.Element {
    const [current, setCurrent] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0)
    const [NiiTAmount, setNiiTAmount] = useState<number>(0)
    const activeGuide = guides[current];
    const { sn, header, message } = activeGuide;

    const handleInput =(e:any):void=>{
        setAmount(e.target.value);
        convertToNiit(e.target.value);

    }
    const convertToNiit = (num:number):void =>{
        const init:number = num/20
        setNiiTAmount(init + (init * 0.04))
    }
    useEffect(() => {
        const nextSlide = (): void =>
            setCurrent((current: number) => (current + 1) % guides.length);
        const next = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(next);
    }, [current]);
    return (
        <main className="flex-center-between px-[5%] h-full w-full gap-x-8">
            <section>
                <Header
                    header="Bond"
                    description=" Bond your assets and earn Nahmii DAO tokens at a discount."
                />

                <div className=" flex-start-start mt-8 max-w-[42rem] h-28 glass p-8 rounded-tl-2xl rounded-tr-2xl flex-col text-white">
                    <div className="flex-center-start gap-x-4 mb-2">
                        <span className="text-cerulean font-bold">{`${sn + 1}/${
                            guides.length
                        }`}</span>
                        <h2 className=" font-bold capitalize">{header}</h2>
                    </div>
                    <p>{message}</p>
                </div>
                <div className="flex-center-center max-w-[42rem] gap-x-8 glass bg-richBlack rounded-br-2xl rounded-bl-2xl p-8">
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
            </section>

            <section className="page-content flex-center-between flex-col py-12 w-full text-white">
                <h2 className="font-bold text-left w-full text-2xl mb-4">
                    Bond Asset
                </h2>
                <div className="w-full grid gap-y-4">
                    <div className="flex-center-between ">
                        <h3>You give</h3>
                        <div className="flex-center-between gap-x-8">
                            <p>Balance: {0.0}</p>
                            <button className="btn-no-fill" onClick={()=>{setAmount(1000); convertToNiit(1000)}}>Max</button>
                        </div>
                    </div>
                    <div className="relative flex-center-between">
                        <input
                            type="number"
                            placeholder="0.00"
                            name="amount-in"
                            value={amount}
                            onChange={handleInput}
                            className="input-field py-2"
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
                            className="input-field py-2"
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
                <button className="btn-no-fill">Confirm</button>
            </section>
        </main>
    );
}

export default Bond;
