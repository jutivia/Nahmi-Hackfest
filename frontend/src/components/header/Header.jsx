import React from "react";


function Header({ header, description }){
    return (
        <header className="flex-start-start w-full mx-auto flex-col">
            <h1 className="text-cerulean font-bold text-3xl my-2">{header}</h1>
            <p className="text-white">{description}</p>
        </header>
    );
}

export default Header;
