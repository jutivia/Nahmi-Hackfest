import React from "react";

function BenefitCard({ benefit }) {
    return (
        <div className="glass max-w-[30rem] rounded-xl w-full h-[20vh] max-h-[12.5rem]">
            <h3 className="glass py-2 sm:py-4 font-bold capitalize text-cerulean rounded-tl-xl rounded-tr-xl text-center">
                {benefit.title}
            </h3>
            <p className="p-2 sm:p-4 text-white">{benefit.description}</p>
        </div>
    );
}

export default BenefitCard;
