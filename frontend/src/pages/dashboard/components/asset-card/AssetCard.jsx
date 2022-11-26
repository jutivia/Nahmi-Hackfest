import React from "react";

function AssetCard({ asset }) {
    return (
        <div className="max-w-[30rem] rounded-xl w-full h-min-content ">
            <h3 className="glass py-2 sm:py-4 font-bold capitalize text-cerulean rounded-tl-xl rounded-tr-xl text-center">
                {asset.title} Balance
            </h3>
            <ul className="bg-[rgba(255,255,255,0.05)] rounded-bl-xl rounded-br-xl">
                {asset.tokens.map((token) => (
                    <li
                        key={token.symbol}
                        className="p-2 sm:p-4 text-white flex-center-between"
                    >
                        <div className="flex-center-start gap-x-2">
                            <div className="aspect-square w-6">
                                <img src={token.image} alt={token.symbol} />
                            </div>
                            <p>{token.symbol}</p>
                        </div>
                        <p>{token.balance}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AssetCard;
