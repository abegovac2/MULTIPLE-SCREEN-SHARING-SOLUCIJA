import React from "react";
import { Link } from "react-router-dom";

function Error() {
    return (
        <div className="error align">
            <div>
                <br />
                <br />
                <h1>An error occured</h1>
                <br />

                <Link to="/">Return to login</Link>
            </div>
        </div>
    );
}

export default Error;
