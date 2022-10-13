import React from "react";
import symbol from "assets/png/nahmii-logo.png";
function Balance(): JSX.Element {
    return (
        <div className="flex-center-center gap-x-2 bg-cerulean px-4 py-2 rounded-[10px]">
            <img
                src={symbol}
                alt="token symbol"
                className="aspect-square w-6 bg-richBlack rounded-[50%]"
            />
            <span>0.00 NII</span>
        </div>
    );
}

export default Balance;
