import React, {useState} from "react";
import Fetch from './data/fetch';
import './games.css';
import Create from "./data/create";
import Accordion from 'react-bootstrap/Accordion';

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