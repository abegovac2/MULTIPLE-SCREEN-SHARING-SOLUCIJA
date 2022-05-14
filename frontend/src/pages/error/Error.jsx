import React from "react";
import { Link } from "react-router-dom";

function Error() {
    return (
        <div>
            <h1>An error occured</h1>
            <Link to="/">Retrutn to login</Link>
        </div>
    );
}

export default Error;
