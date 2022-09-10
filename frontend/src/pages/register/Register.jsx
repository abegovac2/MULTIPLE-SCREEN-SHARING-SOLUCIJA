import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "./register.css";
import { Context } from "../../store/NavbarShowContext";

function Register() {
    function validateEmail(mail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
    }

    // React States
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const { toggleNavBar, setCurrentUser } = useContext(Context);

    const handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        setIsSubmitted(true);

        var { uname, pass, email } = document.forms[0];

        uname = uname.value;
        pass = pass.value;
        email = email.value;

        if (!validateEmail(email)) {
            setErrorMessages({
                name: "email",
                message: "Invalid mail format",
            });
            setIsSubmitted(false);
            return;
        }

        const params = `/?userName=${uname}&email=${email}&password=${pass}`;
        // Find user login info
        console.log("api link", `${window.location.origin}/api`);
        const response = await fetch(
            `${window.location.origin}/api` + "/user/register" + params,
            {
                method: "POST",
            }
        );
        switch (response.status) {
            case 201:
                const { token, user } = await response.json();
                document.cookie = `token=${token};path=/`;
                toggleNavBar();
                setCurrentUser(user);
                navigate("/search");
                break;
            case 409:
                setErrorMessages({
                    name: "user",
                    message: "Duplicate user",
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
                        <label>Username</label>
                        <input
                            className="login"
                            type="text"
                            name="uname"
                            required
                        />
                        {renderErrorMessage("uname")}
                    </div>
                    <div className="login input-container">
                        <label>Email</label>
                        <input
                            className="login"
                            type="text"
                            name="email"
                            required
                        />
                        {renderErrorMessage("email")}
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
export default Register;
