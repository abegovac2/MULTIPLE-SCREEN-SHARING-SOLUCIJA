import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "./login.css";
import { Context } from "../../store/NavbarShowContext";

function Login() {
    // React States
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const { toggleNavBar, setCurrentUser } = useContext(Context);

    const handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        setIsSubmitted(true);

        var { uname, pass } = document.forms[0];

        uname = uname.value;
        pass = pass.value;
        console.log("imal te", `${window.location.origin}/api`);
        const params = `/?userName=${uname}&email=${uname}&password=${pass}`;
        // Find user login info
        const response = await fetch(
            `${window.location.origin}/api` + "/user/login" + params,
            {
                method: "GET",
            }
        );
        switch (response.status) {
            case 200:
                const { token, user } = await response.json();
                document.cookie = `token=${token};path=/`;
                toggleNavBar();
                setCurrentUser(user);
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
