import React from "react";
//import "./chat.css";
import { ChatRoom } from "./chatRoom";
import Members from "./Members";
import CommInfo from "./commMain";
import Accordion from 'react-bootstrap/Accordion';
import { useLocation } from "react-router-dom";


const Chat = () => {
    const location = useLocation();
    const com = location.state;
    const name = com["name"]; 
    const id = com["id"]; 

    return (
      <>
        <Accordion defaultActiveKey={['0']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Community Info</Accordion.Header>
          <Accordion.Body>
            <div>
            <CommInfo cid={id} />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Community Members</Accordion.Header>
          <Accordion.Body>
            <div>
            <Members cid={id}/>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>After Games Rating</Accordion.Header>
          <Accordion.Body>
            <div>
            <Members cid={id}/>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Community Chat</Accordion.Header>
          <Accordion.Body>
            <div>
            <h1>{name} Chat💬</h1>
            <section><ChatRoom cid={id}/></section>
            </div>
          </Accordion.Body>
        </Accordion.Item>
       
      </Accordion>
      </>
    );
  }

  export default Chat;