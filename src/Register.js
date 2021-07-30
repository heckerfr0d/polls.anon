import React, { useState } from "react";
import { login, useAuth, logout } from "./auth";
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

function Register() {
    const [logged] = useAuth();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [message, setMessage] = useState('')


    const onSubmitClick = (e) => {
        e.preventDefault()
        let opts = {
            'username': username,
            'password': password
        }
        fetch('/api/register/', {
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
                    setMessage("This username is already taken. Please try another.");
                }
            })
    }

    const handleUsernameChange = (e) => {
        setMessage('');
        setUsername(e.target.value)
        if (isIllegal(e.target.value))
            setMessage('Username can only contain letters, numbers and underscores.');
    }

    const handlePasswordChange = (e) => {
        setMessage('');
        setPassword(e.target.value);
        if (e.target.value.length < 6)
            setMessage("Password must be at least 6 characters.");
    }

    const handlePassword2Change = (e) => {
        setMessage('');
        setPassword2(e.target.value);
        if (password !== e.target.value)
            setMessage("Passwords don't match.");
    }
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    Sign Up to get Started!
                </Card.Title>
                { message ? <Alert variant="danger">{message}</Alert> : null }
                <Form onSubmit={onSubmitClick}>
                    <Form.Group className="mb-2" controlId="formUsername">
                        <Form.Label htmlFor="username">Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" onChange={handleUsernameChange} value={username} />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} value={password} />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formPassword2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" onChange={handlePassword2Change} value={password2} />
                    </Form.Group>
                    <Button type="submit">Sign Up</Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

function isIllegal(username) {
    return /[^a-zA-Z0-9_]/.test(username);
}

export default Register;