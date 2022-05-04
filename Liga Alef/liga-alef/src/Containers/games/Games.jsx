import React, {useState, useEffect} from "react";
import db from "./firebaseStorage";
import Fetch from './server/fetch';
import './games.css';

const Games = () => {

  const [game, setGame] = useState({gameId: "", location:"", minP:"", maxP:"", pitch:""});

  const handleChange = (event) =>{
    event.preventDefault();
    const {name, value} = event.target;
    setGame((prev) => {
      return {...prev, [name]: value};
    });
  };

  const addDoc = (event) => {
    event.preventDefault();

    db.collection("Games").add({
      Gid: game.gameId,
      Location: game.location,
      minP: game.minP,
      maxP: game.maxP,
      Pitch: game.pitch
    }).then((ducRef) => {
      const ducId = ducRef.id;
      console.log(ducId);
    }).catch((err) =>{
      console.log("Error " + err.message);
    })
  }

  const setDoc = (event) => {
    event.preventDefault();

    db.collection("Games").doc("Game14").set({
      Gid: game.gameId,
      Location: game.location,
      minP: game.minP,
      maxP: game.maxP,
      Pitch: game.pitch
    }).then((ducRef) => {
      const ducId = ducRef.id;
      console.log(ducId);
    }).catch((err) =>{
      console.log("Error " + err.message);
    })
  }

  return (
    <>
    <div>
      <h1>Form</h1>
      <form onSubmit={addDoc}>
        <input type='number' name='gameId' value={game.gameId} onChange={handleChange} placeholder="Game ID" /><br />
        <input type='text' name='location' value={game.location} onChange={handleChange} placeholder="Location" /><br />
        <input type='text' name='pitch' value={game.pitch} onChange={handleChange} placeholder="Pitch" /><br />
        <input type='number' name='minP' value={game.minP} onChange={handleChange} placeholder="Min Players" /><br />
        <input type='number' name='maxP' value={game.maxP} onChange={handleChange} placeholder="Max Players" /><br />

        <button>Save Game</button>
      </form>
    </div>
    <div>
      <Fetch />
    </div>
    </>
  );
}

export default Games