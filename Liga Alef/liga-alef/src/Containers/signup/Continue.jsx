import React, {useState, useEffect, useContext} from "react";
import db from "../search/firebaseStorage";
import { getUserName, getUserId, getUserEmail } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import './signup.css';

const Continue = () => {
  const navigate = useNavigate();

  const addDocument = (event) => {
    event.preventDefault();

    var ref = db.collection("Users").doc();
    ref.set({
      User_ID: ref.id,
      Name: getUserName(),
      Email: getUserEmail(),
      Grades: { Soccer: '2.5',
                Basketball: '2.5',
                Vollyball: '2.5'},
      Communities: [],
      AuthID: getUserId()}
      ).then(() => {
      var newDocRef= db.collection("Users").doc();
      navigate('/');
    }).catch((err) =>{
      console.log("Error " + err.message);
    })
  }

  return (
    <>
    <div>
      <h1>Signed Up Successfully!</h1><br />
      <h5>Welcome To Liga Alef Family {getUserName()}!</h5><br />
      <form onSubmit={addDocument}>    
        <button>complete user setup</button>
      </form>
    </div>
    </>
  );
}

export default Continue
