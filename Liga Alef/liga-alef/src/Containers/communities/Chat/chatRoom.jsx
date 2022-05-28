import React from "react";
// import "./chat.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useState, useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getUserId, getUserName } from "../../../Context/AuthContext";
import db from "../../games/firebaseStorage";
import { getDisplayName } from "@mui/utils";


export const ChatRoom = (props) => {
    //console.log(props.cid);
    const dummy = useRef();
  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt").limitToLast(25);

  const [messages] = useCollectionData(query, { idField: "uid" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: getUserId(),
      cid: props.cid,
      uname: getUserName(),
    });

    setFormValue("");
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <main>
        {messages && messages.map((msg) => msg.cid === props.cid &&<ChatMessage message={msg} name={msg.uname}/>)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
  };
  
  function ChatMessage(props) {
    const { text, uid } = props.message;
    const name = props.name;
    const messageClass = uid === getUserId() ? "sent" : "received";
    return (
      <div className={`message ${messageClass}`}>
        <p>{name} : {text}</p>
      </div>
    );
  }

