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
import Create from "./Create";
import './App.css';

function App() {
  const [logged] = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);
  const [create, showCreate] = React.useState(false);
  let home;
  if(logged)
  {
    if(create)
      home = <Create />;
    else
      home = <User />;
  }
  else if (showLogin)
    home = <Login />;
  else
    home = <Register />;
  return (
    <Container>
      <Router>
        <Navbar bg="light" variant="light" expand="sm">
          <Container>
            <Navbar.Brand href="/">
              Polls.Anon
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {!logged ?
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                {!showLogin ?
                <Nav.Link onClick={()=>setShowLogin(true)}>Login</Nav.Link> :
                <Nav.Link onClick={()=>setShowLogin(false)}>Sign Up</Nav.Link> }
              </Navbar.Collapse>
              : <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav.Link onClick={()=>showCreate(true)} variant="success">New Poll</Nav.Link>
                <Nav.Link onClick={()=>showCreate(false)}>My Polls</Nav.Link>
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
                {home}
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

function Home() {
  return (
    <Container>
      <Button>
        Get Started
      </Button>
    </Container>
  );
}

export default App;
