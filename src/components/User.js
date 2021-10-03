import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth"
import CardGroup from "react-bootstrap/CardGroup";

function User() {
    const [id, setId] = useState('')
    const [active, setActive] = useState([])
    const [expired, setExpired] = useState([])
    const [tab, setTab] = useState(true)
    const [data, setData] = useState({})
    const [showModal, setShowModal] = useState(false)
    let acard, ecard;
    useEffect(() => {
        authFetch("https://polls-anon.herokuapp.com/api/polls/").then(response => {
            if (response.status === 401) {
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
    acard = [];
    const view = (i, b) => {
        console.log(i,  active.length);
        if (b==='e')
            setId(expired[i][0]);
        else
            setId(active[i][0]);
        authFetch("https://polls-anon.herokuapp.com/api/view/" + id + "/").then(response => {
            if (response.status === 401) {
                return null;
            }
            return response.json()
        }).then(response => {
            if (response && response.qn) {
                setData(
                    {
                        'link': "https://polls-anon.netlify.app/"+id+"/",
                        'qn': response.qn,
                        'opts': response.opts,
                        'one': response.one,
                        'two': response.two
                    }
                );
                setShowModal(true);
            }
        })
    }
    for (var i in active) {
        let a = i;
        acard.push(
            <Card key={active[i]+active[i][1]} onClick={() => view(a, 'a')} style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>
                        {active[i][1]}
                    </Card.Title>
                    <div>
                        <Button disabled size="sm" variant="secondary">{active[i][2][0]}</Button>
                        <Button disabled size="sm" variant="secondary">{active[i][2][1]}</Button>
                    </div>
                    <small className="mb-2 text-muted">
                        {/* Created: {active[i][2].replace('GMT', '')}
                        <br /> */}
                        Expires: {active[i][3].replace('GMT', '')}
                    </small>
                </Card.Body>
            </Card>
        );
    }
    ecard = [];
    for (var i in expired) {
        let a = i;
        ecard.push(
            <Card key={expired[i]+expired[i][1]} onClick={() => view(a, 'e')} style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>
                        {expired[i][1]}
                    </Card.Title>
                    <small className="mb-2 text-muted">
                    {/* {console.log(expired)}
                        Created: {new Date(expired[i][2]).toLocaleString()}
                        <br /> */}
                        Expired: {new Date(expired[i][3]).toLocaleString()}
                    </small>
                </Card.Body>
            </Card>
        );
    }
    return (
        <Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{data['qn']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Link: <Link to={"/"+id}>{data['link']}</Link>
                    <br />
                    Total votes: {data['one'] + data['two']}
                    <br />
                    <Button disabled size="sm" className="mb-2" variant="secondary">{data['opts']? data['opts'][0] : null}</Button>: {data['one']}
                    <br />
                    <Button disabled size="sm" className="mb-2" variant="secondary">{data['opts']? data['opts'][1] : null}</Button>: {data['two']}
                    <div>
                    <ProgressBar max={data['one'] + data['two']}>
                        <ProgressBar max={data['one'] + data['two']} variant="success" now={data['one']} key={1} label={data['opts']? data['opts'][0]:null} />
                        <ProgressBar max={data['one'] + data['two']} variant="danger" now={data['two']} key={2} label={data['opts']? data['opts'][1]:null} />
                    </ProgressBar>
                    </div>
                </Modal.Body>
            </Modal>
            <Nav variant="tabs">
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