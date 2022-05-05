import React, { useState } from "react";
import db from "../firebaseStorage";
import Alert from 'react-bootstrap/Alert';
import Button from "react-bootstrap/Button";
import { getUserId } from "../../../Context/AuthContext";

function Create(){
  const [game, setGame] = useState({day: "",month: "",year: "",time: "", location:"", minP:"", maxP:"", pitch:"", teams:""});
  const [show, setShow] = useState(false);
  const [Community, setCommunity] = useState({id: "", name:""});

  const [Comm, setComm] = useState([]);

  const handleChange = (event) =>{
    event.preventDefault();
    const {name, value} = event.target;
    setGame((prev) => {
      return {...prev, [name]: value};
    });
  };

  const handleSelect = (key) => (event) => {
    event.preventDefault();
  setCommunity({ [key]: event.target.value });
  console.log(Community);
  };

  const addDoc = (event) => {
    event.preventDefault();
    var ref = db.collection("Games").doc();
    ref.set({
      Gid: ref.id,
      Location: game.location,
      minP: game.minP,
      maxP: game.maxP,
      Pitch: game.pitch,
      Teams: game.teams,
      Players: [],
      Date: {Day: game.day, Month: game.month, Year: game.year},
      Time: game.time,
      Community: {Id: Community.id, Name: "Comm"}
    }).then(() => {
      setShow(true);
    }).catch((err) =>{
      console.log("Error " + err.message);
    })
  }

  function fetchAll(e){
    e.preventDefault();

    db.collection("Users").doc(getUserId()).get().then((snapshot)=>{
        if(snapshot){
            setComm(snapshot.data().Communities);
        }
    });
    }

    return(
        <>
        <Alert show={show} variant="success">
        <Alert.Heading>Game Has Successfully Created!</Alert.Heading>
            <p>Please Refresh the page to Show the Game Details</p>
            <hr />
            <div className="d-flex justify-content-end">
            <Button onClick={() => setShow(false)} variant="outline-success">Ok!</Button>
            </div>
        </Alert>
        <div>
        <h1>Form</h1>
        <form onSubmit={addDoc}>
            <input type='text' name='location' value={game.location} onChange={handleChange} placeholder="Location" /><br />
            <input type='text' name='pitch' value={game.pitch} onChange={handleChange} placeholder="Pitch" /><br />
            <input type='number' name='minP' value={game.minP} onChange={handleChange} placeholder="Min Players" /><br />
            <input type='number' name='maxP' value={game.maxP} onChange={handleChange} placeholder="Max Players" /><br />
            <input type='number' name='teams' value={game.teams} onChange={handleChange} placeholder="Number Of Teams" /><br />
            <input type='number' name='day' value={game.day} onChange={handleChange} placeholder="Day" /><br />
            <input type='number' name='month' value={game.month} onChange={handleChange} placeholder="Month" /><br />
            <input type='number' name='year' value={game.year} onChange={handleChange} placeholder="Year" /><br />
            <input type='text' name='time' value={game.time} onChange={handleChange} placeholder="Time - hh:mm" /><br />
            <button onClick={fetchAll}>Search</button>
            <div>
                <select value={Community.id} onChange={handleSelect("id")}>
                <option value="">Choose Community</option>
                {Comm.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
            </div>
            <br />
            <button>Save Game</button>
        </form>
        </div>
        </>
    )
}

export default Create;