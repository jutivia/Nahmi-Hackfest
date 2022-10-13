import React from "react";
import Tokens from "./components/tokens/Tokens";

function Dashboard(): JSX.Element {
    return (
        <div className="grid place-items-center h-screen m-auto w-full">
            <Tokens />
        </div>
    );
}

export default Dashboard;
