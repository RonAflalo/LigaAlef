import React, {useState, useEffect, useContext} from "react";
import db from "../search/firebaseStorage";
import { getUserName, getUserId } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

import './signup.css';

const Continue = () => {
    const [userCom, setUserCom] = useState({community: ""});
    const navigate = useNavigate();

  const handleChange = (event) =>{
    event.preventDefault();
    const {name, value} = event.target;
    setUserCom((prev) => {
        return {...prev, [name]: value};
      });
  };

  const handleSelect = (key) => (event) => {
    setUserCom({ [key]: event.target.value });
    window.location.reload();
  };

  const addDoc = (event) => {
    event.preventDefault();

    db.collection("Community").add({
        PlayerID: getUserId(),
        Name: getUserName(),
        Garde: "2.5",
    }).then((ducRef) => {
      const ducId = ducRef.id;
      console.log(ducId);
      navigate('/');
    }).catch((err) =>{
      console.log("Error " + err.message);
    })
  }

  const setDoc = (event) => {
    event.preventDefault();

    db.collection("Community").doc("Players").set({
        PlayerID: "5",
        Name: "Moshe",
        Garde: "2.5",
    }).then((ducRef) => {
      const ducId = ducRef.id;
      console.log(ducId);
      navigate('/');
    }).catch((err) =>{
      console.log("Error " + err.message);
    })
  }

  return (
    <>
    <div>
      <h1>Sign Uo Successful!</h1><br />
      <h5>Welcome To Lega Alef Family</h5><br />
      <h1>Choose Your Community:</h1> <br />
      <form onSubmit={addDoc}>
        <h1>User: {getUserName()}</h1><br />
        <h1>Id: {getUserId()}</h1><br />
        <input type='text' name='community' value={userCom.community} onChange={handleChange} placeholder="Select Community" /><br />

        <button>Select</button>
      </form>
    </div>
    </>
  );
}

export default Continue