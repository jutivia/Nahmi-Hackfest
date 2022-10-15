import React from "react";
import { Link } from "react-router-dom";

function Error() {
    return (
        <section className="h-[100vh] text-white background flex-center-center flex-col font-bold">
            <h1>Error 404!</h1>
            <p>This page does not exist.</p>

            <Link to="/" className="btn-no-fill my-8">
                Back Home
            </Link>
        </section>
    );
}

export default Error;
