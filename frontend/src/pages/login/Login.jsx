import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "./login.css";

function Login({ setCookie }) {
    // React States
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        setIsSubmitted(true);

        var { uname, pass } = document.forms[0];

        // Find user login info
        const response = await fetch(process.env.API_LINK, {
            method: "GET",
            data: {
                userName: uname,
                email: uname,
                password: pass,
            },
        });

        switch (response.status) {
            case 200:
                let user = response.body;
                setCookie(user);
                navigate("/search");
                break;
            case 404:
                setErrorMessages({
                    name: "uname",
                    message: "Invalid user name or email",
                });
                setIsSubmitted(false);
                break;
            case 409:
                setErrorMessages({
                    name: "pass",
                    message: "Invalid password for user",
                });
                setIsSubmitted(false);
                break;
            default:
                navigate("/error");
        }
    };

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

    // JSX code for login form
    const renderForm = (
        <>
            <div className="login title">Sign In</div>

            <div className="login form">
                <form onSubmit={handleSubmit}>
                    <div className="login input-container">
                        <label>Username or email</label>
                        <input
                            className="login"
                            type="text"
                            name="uname"
                            required
                        />
                        {renderErrorMessage("uname")}
                    </div>
                    <div className="login input-container">
                        <label>Password </label>
                        <input
                            className="login"
                            type="password"
                            name="pass"
                            required
                        />
                        {renderErrorMessage("pass")}
                    </div>
                    <div className="login button-container">
                        <Button variant="outline-primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );

    return (
        <div className="login container">
            <div className="login login-form">
                {isSubmitted ? (
                    <>
                        <Spinner animation="grow" size="sm" variant="primary" />
                        <Spinner animation="grow" size="sm" variant="primary" />
                        <Spinner animation="grow" size="sm" variant="primary" />
                    </>
                ) : (
                    renderForm
                )}
            </div>
        </div>
    );
}
export default Login;
