import { Button, Card, Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';


function Vote({URL}) {
    const [qn, setQn] = useState('');
    const [opts, setOpts] = useState([]);
    const [expire, setExpire] = useState('');
    const[done, setDone] = useState(false);
    const {id} = useParams();
    useEffect(() => {
        fetch(`${URL}/api/poll/` + id + "/").then(response => {
            return response.json()
        }).then(response => {
            if (response && response.id) {
                if(response.expire<Date.now()) {
                    alert("This poll has closed");
                    setDone(true);
                }
                setQn(response.qn);
                setOpts(response.opts);
                setExpire(response.expire);
            }
        })
    }, [])
    const vote = (i) => {
        fetch(`${URL}/api/vote/` + id + "/" + i + "/").then(response => {
            if (response.status === 200) {
                alert("Vote recorded!");
                setDone(true);
            }
        }
        )
    };
    return (
        <Container>
            { done ? <Redirect to="/"/> : null}
            <Card>
                <Card.Body>
                    <Card.Title>
                        {qn}
                    </Card.Title>
                    <Button bsStyle="primary" onClick={() => vote(1)}>
                        {opts[0]}
                    </Button>
                    <Button bsStyle="primary" onClick={() => vote(2)}>
                        {opts[1]}
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Vote;