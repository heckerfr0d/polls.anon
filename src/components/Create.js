import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authFetch } from "../utils/auth"

function Create({URL}) {
  const [expiry, onChange] = useState(`${new Date().toISOString().split('T')[0]} ${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}`);
  // const [title, onTitleChange] = useState('');
  const [questions, setQuestions] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [showT, setShowT] = useState(false);
  const [id, setId] = useState('');
  const qn = (i) => {
    return (
      <Row key={i} xs={1} md={1} className="g-3">
        <Card>
          <Card.Body>
            <Form.Group className="mb-2">
              <Form.Control as="textarea" placeholder={"Question "} onChange={(e) => setQuestions(e.target.value)} />
              <Form.Control type="text" placeholder="Option 1" onChange={(e) => setOpt1(e.target.value)} />
              <Form.Control type="text" placeholder="Option 2" onChange={(e) => setOpt2(e.target.value)} />
              {/* <Form.Control type="button" value="Add Option" /> */}
            </Form.Group>
          </Card.Body>
        </Card>
      </Row>
    );
  }
  const [qns, addQns] = useState([qn(1)]);
  const save = () => {
    let data = {
      'qn': questions,
      'opts': [opt1, opt2],
      'expire': expiry
    }
    authFetch(`${URL}/api/create/`, {
      method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
          }).then(response => {
      if (response.status === 401) {
        return null;
      }
      return response.json()
    }).then(response => {
      if (response && response.id) {
        setShowT(true);
        setId(response.id);
      }
    })
  }
  return (
    <Container>
        <Modal show={showT} onHide={()=>setShowT(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Poll Created!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Here's your link: <Link to={"/"+id}>https://polls-anon.netlify.app/{id}/</Link></Modal.Body>
      </Modal>
      <Form>
        <Form.Group className="mb-2">
          {/* <CardGroup> */}
          {qns}
          {/* </CardGroup> */}
          <Row>
            <Col>
              <Form.Label>Closing Date</Form.Label>
            </Col>
            <Col>
              <Form.Label>Closing Time</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control type="date" value={expiry.slice(0, 10)} onChange={(e) => onChange(e.target.value + " " + expiry.slice(11))} />
            </Col>
            <Col>
              <Form.Control type="time" value={expiry.slice(11)} onChange={(e) => onChange(expiry.slice(0, 10) + " " + e.target.value)} />
            </Col>
          </Row>
        </Form.Group>

        {/* <Button onClick={() => {
          addQns(qns => [...qns, qn(qns.length + 1)]);
        }}>
          Add Question
        </Button> */}
        <Button onClick={save}>Save</Button>
      </Form>
    </Container>
  );
}

export default Create;