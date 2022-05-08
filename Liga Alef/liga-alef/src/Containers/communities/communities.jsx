import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserId, getUserName } from "../../Context/AuthContext";
import db from "../games/firebaseStorage";
import './communities.css'
import Fetch from "./fetch";

 const Communities = () =>{
    const [comm, setComm] = useState ({name: "", type: "", maxmember: ""});
    const navigate = useNavigate();

    const handleChange = (event) =>{
        event.preventDefault();
        const {name, value} = event.target;
        setComm((prev) => {
          return {...prev, [name]: value};
        });
      };

    const addDocument = (event) => {
        event.preventDefault();
    
        var ref = db.collection("Community").doc();
        ref.set({
          Community_ID: ref.id,
          Name: comm.name,
          Type: comm.type,
          MaxMember: comm.maxmember,
          Members: [],
          ActiveGames: [],
          AdminID: {Id: getUserId(), Name: getUserName()}}
          ).then(() => {
          navigate('/');
        }).catch((err) =>{
          console.log("Error " + err.message);
        })
      }
    

    return(
        <>
        <div>
        <h1>My Communities</h1>
        <h4>List - Admin zone + Members + ???</h4>

        <h1>Community Search</h1>
        <Fetch />

        <h1>Create Community</h1>
        <form onSubmit={addDocument}>   
            <input type='text' name='name' value={comm.name} onChange={handleChange} placeholder="Community Name" /><br />
            <input type='text' name='type' value={comm.type} onChange={handleChange} placeholder="Type" /><br />
            <input type='number' name='maxmember' value={comm.maxmember} onChange={handleChange} placeholder="Max Member" /><br /> 
        <button>Create!</button>
        </form>
        </div>
        </>
    );
}

export default Communities