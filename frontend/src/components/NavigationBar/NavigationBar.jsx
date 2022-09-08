import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Context } from "../../store/NavbarShowContext";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
    const { show, toggleNavBar, user, setCurrentUser } = useContext(Context);
    const navigate = useNavigate();

    const removeToken = () => {
        document.cookie = "token=; Max-Age=-99999999;";
        setCurrentUser({});
        toggleNavBar();
    };

    const navFunctions = (route) => () => navigate(route);

    return (
        <Navbar fixed="top" bg="primary" variant="dark">
            <Navbar.Brand onClick={navFunctions("/search")}>Meets</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                {!show && (
                    <Nav className="me-auto">
                        <Nav.Link onClick={navFunctions("/")}>Login</Nav.Link>
                        {/*<Nav.Link href="/enter">Enter</Nav.Link>*/}
                        <Nav.Link onClick={navFunctions("/register")}>
                            Register
                        </Nav.Link>
                        {/*<Nav.Link href="/list-users">Users</Nav.Link>*/}
                    </Nav>
                )}
                {show && (
                    <Nav className="me-auto">
                        <Nav.Link onClick={navFunctions("/search")}>
                            Search
                        </Nav.Link>
                        {/*<Nav.Link href="/enter">Enter</Nav.Link>*/}
                        <Nav.Link onClick={navFunctions("/create")}>
                            Create
                        </Nav.Link>
                        {/*<Nav.Link href="/list-users">Users</Nav.Link>*/}
                    </Nav>
                )}
                <Nav className="w-100 justify-content-end">
                    {show && (
                        <>
                            <Navbar.Text>
                                Signed in as:{" "}
                                <a href="/user">{user.userName}</a>
                            </Navbar.Text>{" "}
                            <Nav.Link href="/" onClick={removeToken}>
                                Log out
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;
