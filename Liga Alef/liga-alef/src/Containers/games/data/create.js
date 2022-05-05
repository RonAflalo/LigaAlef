import React, { useState } from "react";
import db from "../firebaseStorage";
import Alert from 'react-bootstrap/Alert';
import Button from "react-bootstrap/Button";
import { getUserId } from "../../../Context/AuthContext";
import firebase from 'firebase/compat/app';

function Create(){
  var fields;
  const [game, setGame] = useState({day: "",month: "",year: "",time: "", location:"", minP:"", maxP:"", pitch:"", teams:""});
  const [show, setShow] = useState(false);
  const [Community, setCommunity] = useState({id: "", name:""});
  const [arr, setArr] = useState([]);
  const [res, setRes] = useState([]);

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
  db.collection("Community").doc(event.target.value).get().then((value) => {
    fields = value.data();
    setCommunity({id:event.target.value, name:fields.Name});
    })
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
      Community: {Id: Community.id, Name: Community.name}
    }).then(() => {
      setShow(true);
      var newGame = db.collection('Community').doc(Community.id);
      console.log(newGame);
      console.log(ref.id);
      newGame.update({ActiveGames: firebase.firestore.FieldValue.arrayUnion(ref.id)});
    }).catch((err) =>{
      console.log("Error " + err.message);
    })
  }



  function GetCommunities(){
  db.collection("Users").doc(getUserId()).get().then((value) => {
     fields = value.data();
     fields = fields.Communities;
     setArr(fields);
  });
  }

  function addToRes(item){
      db.collection("Community").doc(item).get().then((value) =>{
          var temp = value.data();
          setRes(res => [...res, temp]);
      })
  }

  function fetchAll(e){
    e.preventDefault();
    GetCommunities();
    setRes([]);
    for(const i in arr){
        addToRes(arr[i]);
        } 
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
            <button onClick={fetchAll}>Click me twice before select Community and then save</button>
            <div>
                <select value={Community.id} onChange={handleSelect("id")}>
                <option value="">Choose Community</option>
                {res.map(option => (
                  <option value={option.Community_ID} key={option.id}>{option.Name}</option>
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