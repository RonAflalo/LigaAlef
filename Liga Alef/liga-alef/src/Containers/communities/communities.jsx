import React, { useState } from "react";
import './communities.css'
import Fetch from "./data/fetch";
import Create from "./data/create";
import FetchMyComm from "./data/fetchMyComm";
import Accordion from 'react-bootstrap/Accordion';

const Communities = () =>{

    

    return(
      <>

      <Accordion defaultActiveKey={['1']} alwaysOpen>
  <Accordion.Item eventKey="0">
    <Accordion.Header>Create Community</Accordion.Header>
    <Accordion.Body>
      <div>
      <Create />
      </div>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>My Communities</Accordion.Header>
    <Accordion.Body>
      <div>
      <FetchMyComm />
      </div>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="3">
    <Accordion.Header>Communities Search</Accordion.Header>
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

export default Communities