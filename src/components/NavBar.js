import React from 'react'
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { logout } from "../utils/auth";

function NavBar({logged, showLogin, setShowLogin, showCreate}) {
    return (
        <Navbar bg="light" variant="light" expand="sm">
          <Container>
            <Navbar.Brand href="/">
              Polls.Anon
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {!logged ?
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                {!showLogin ?
                  <Nav.Link onClick={() => setShowLogin(true)}>Login</Nav.Link> :
                  <Nav.Link onClick={() => setShowLogin(false)}>Sign Up</Nav.Link>}
              </Navbar.Collapse>
              : 
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav.Link onClick={() => showCreate(true)} variant="success">New Poll</Nav.Link>
                <Nav.Link onClick={() => showCreate(false)}>My Polls</Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </Navbar.Collapse>}
          </Container>
        </Navbar>
    )
}

export default NavBar
