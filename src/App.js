import React from "react";
import {
  Switch,
  Route
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Login from './components/Login';
import Register from "./components/Register";
import { useAuth } from "./utils/auth";
import User from "./components/User";
import Create from "./components/Create";
import Vote from "./components/Vote";
import NavBar from './components/NavBar'
import './App.css';

function App() {
  const [logged] = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);
  const [create, showCreate] = React.useState(false);

  return (
    <Container>
        <NavBar setShowLogin={setShowLogin} showCreate={showCreate} logged={logged} showLogin={showLogin} />
        <Switch>
          <Route exact path="/">
            {logged ? 
              create ? <Create/> : <User/>
            :
              showLogin ? <Login /> : <Register />
            }
          </Route>
          <Route path="/:id">
            <Vote />
          </Route>
        </Switch>
    </Container>
  );
}

export default App;
