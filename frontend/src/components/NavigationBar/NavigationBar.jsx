import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavigationBar({ user, setCookie }) {
    const removeToken = () => {
        document.cookie = "token=; Max-Age=-99999999;";
    };

    return (
        <Navbar fixed="top" bg="primary" variant="dark">
            <Navbar.Brand href="/">Meets</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/search">Search</Nav.Link>
                    {/*<Nav.Link href="/enter">Enter</Nav.Link>*/}
                    <Nav.Link href="/create">Create</Nav.Link>
                    {/*<Nav.Link href="/list-users">Users</Nav.Link>*/}
                </Nav>
                <Nav className="w-100 justify-content-end">
                    {user !== "undefined" && (
                        <>
                            <Navbar.Text>
                                Signed in as: <a href="/user">Amar Begovac</a>
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
