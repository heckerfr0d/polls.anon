import React, { useState } from "react";
import { login, useAuth, logout } from "./auth";
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";


function Login() {
    const [logged] = useAuth();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const onSubmitClick = (e) => {
        e.preventDefault()
        setMessage('');
        let opts = {
            'username': username,
            'password': password
        }
        fetch('/api/login/', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(opts)
        }).then(r => r.json())
            .then(token => {
                if (token.access_token) {
                    login(token)
                }
                else {
                    setMessage('Invalid credentials. Please try again.')
                }
            })
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    Login
                </Card.Title>
                { message ? <Alert variant="danger">{message}</Alert> : null }
                <Form onSubmit={onSubmitClick}>
                    <Form.Group className="mb-2" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" onChange={handleUsernameChange} value={username} />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} value={password} />
                    </Form.Group>
                    <Button type="submit" className="btn btn-primary">Login</Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default Login;