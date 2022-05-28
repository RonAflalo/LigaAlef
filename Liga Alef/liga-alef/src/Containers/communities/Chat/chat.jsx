import React from "react";
// import "./chat.css";
import { ChatRoom } from "./chatRoom";
import { useParams ,useLocation} from "react-router-dom";


const Chat =()=> {
    const location = useLocation();
    const com = location.state;
    const name = com["name"]; 
    const id = com["id"]; 
    console.log(name,id);

    return (
      <div className="chat">
        <header>
          {" "}
          <h1>{name} Chat🔥💬</h1>
        </header>
        <section><ChatRoom cid={id}/></section>
      </div>
    );
  }

  export default Chat;