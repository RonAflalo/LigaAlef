import React from "react";
import db from "../games/firebaseStorage";
import { getUserName, getUserId, getUserEmail } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import './signup.css';

const Continue = () => {
  const navigate = useNavigate();

  const addDocument = (event) => {
    event.preventDefault();

    var ref = db.collection("Users").doc(getUserId());
    ref.set({
      Name: getUserName(),
      Email: getUserEmail(),
      Grades: { Soccer: 2.5,
                SoccerVotes: 0,
                Basketball: 2.5,
                BasketballVotes: 0,
                Vollyball: 2.5,
                VollyballVotes: 0},
      Communities: [],
      User_ID: getUserId()}
      ).then(() => {
      navigate('/');
      window.location.reload();
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
