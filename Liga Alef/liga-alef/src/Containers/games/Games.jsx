import React from "react";
import Fetch from './data/fetchCommGame';
import './games.css';
import Create from "./data/createGame";
import Accordion from 'react-bootstrap/Accordion';
import FetchMyGame from "./data/fetchMyGame";

const Games = () => {
  return (
    <>

<Accordion defaultActiveKey={['1']} alwaysOpen>
  <Accordion.Item eventKey="0">
    <Accordion.Header>Create Game</Accordion.Header>
    <Accordion.Body>
      <div>
      <Create />
      </div>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>Show My Games</Accordion.Header>
    <Accordion.Body>
      <div>
        <FetchMyGame />
      </div>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Header>Show Community Games</Accordion.Header>
    <Accordion.Body>
      <div>
        <Fetch />
      </div>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
    </>
  );
}

export default Games