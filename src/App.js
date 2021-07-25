import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Login from './Login';
import Register from "./Register";
import { useAuth, logout } from "./auth";
import User from "./User";
import './App.css';

function App() {
  const [logged] = useAuth();
  return (
    <Container>
      <Router>
          <Navbar bg="light" expand="lg">
            <Container>
              <Navbar.Brand href="/">Polls.Anon</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              {!logged ?
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Sign Up</Nav.Link>
                </Navbar.Collapse>
                : <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                </Navbar.Collapse>}
            </Container>
          </Navbar>

          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
      </Router>
    </Container>
  );
}

function Home() {
  return <h2>Welcome to Polls.Anon</h2>;
}

export default App;
