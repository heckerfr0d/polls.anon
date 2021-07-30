import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import { authFetch } from "./auth"
import { CardGroup } from "react-bootstrap";

function User() {
    const [message, setMessage] = useState('')
    const [active, setActive] = useState('')
    const [expired, setExpired] = useState('')
    const [tab, setTab] = useState(true)
    let acard, ecard;
    useEffect(() => {
        authFetch("/api/polls").then(response => {
            if (response.status === 401) {
                setMessage("Sorry you aren't authorized!");
                return null;
            }
            return response.json()
        }).then(response => {
            if (response && response.active) {
                setActive(response.active);
                setExpired(response.expired);
            }
        })
    }, [])
    acard = Array();
    for (var i in active) {
        acard.push(
            <Card onClick={() => console.log('noice')} style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>
                        {active[i][1]}
                    </Card.Title>
                    <small className="mb-2 text-muted">
                        Created: {active[i][2].replace('GMT', '')}
                        <br />
                        Expires: {active[i][3].replace('GMT', '')}
                    </small>
                </Card.Body>
            </Card>
        );
    }
    ecard = Array();
    for (var i in expired) {
        ecard.push(
            <Card onClick={() => console.log('noice')} style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>
                        {expired[i][1]}
                    </Card.Title>
                    <small className="mb-2 text-muted">
                        Created: {expired[i][2].replace('GMT', '')}
                        <br />
                        Expired: {expired[i][3].replace('GMT', '')}
                    </small>
                </Card.Body>
            </Card>
        );
    }
    return (
        <Container>
            <Nav variant="tabs" defaultActiveKey="/home">
                <Nav.Item>
                    <Nav.Link onClick={() => setTab(true)}>Active</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => setTab(false)}>Expired</Nav.Link>
                </Nav.Item>
            </Nav>
            <CardGroup>
            {tab ? acard : ecard}
            </CardGroup>
        </Container>
    )
}

export default User;