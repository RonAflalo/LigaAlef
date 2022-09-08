import React, { useState,useEffect } from "react";
import db from "../firebaseStorage";
import Alert from 'react-bootstrap/Alert';
import Button from "react-bootstrap/Button";
import { getUserId } from "../../../Context/AuthContext";
import firebase from 'firebase/compat/app';
import {Autocomplete, usePlacesWidget } from 'react-google-autocomplete';
import "./gameData.css";

function Create(){
  const [errorMessage, setErrorMessage] = useState();
  const [game, setGame] = useState({day: 0, month: 0, year: 0, time: "", location:"", minP:0, maxP:0, teamSize: 0, pitch:""});
  const [show, setShow] = useState(false);
  const [Community, setCommunity] = useState({id: "", name:""});
  const [res, setRes] = useState([]);

  useEffect(() => {
      db.collection("Users").doc(getUserId()).get().then((value) => {
      var arr = value.data();
      arr = arr.Communities;
      for(const i in arr){
        addToRes(arr[i]);
        }
      })
  }, [])

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
    var fields = value.data();
    setCommunity({id:event.target.value, name:fields.Name});
    })
  };

  const addDoc = (event) => {
    event.preventDefault();
    validateData();
    if(errorMessage==='')
    {
      var ref = db.collection("Games").doc();
      ref.set({
        Gid: ref.id,
        Location: game.location,
        minP: parseInt(game.minP),
        maxP: parseInt(game.maxP),
        TeamSize: parseInt(game.teamSize),
        Pitch: game.pitch,
        Players: [],
        Waiting: [],
        Voated: [],
        Date: {Day: parseInt(game.day), Month: parseInt(game.month), Year: parseInt(game.year)},
        Time: game.time,
        Community: {Id: Community.id, Name: Community.name}
      }).then(() => {
        setShow(true);
        var newGame = db.collection('Community').doc(Community.id);
        newGame.update({ActiveGames: firebase.firestore.FieldValue.arrayUnion(ref.id)});
        setGame({day: 0, month: 0, year: 0, time: "", location:"", minP:0, maxP:0, teamSize: 0, pitch:""});
      }).catch((err) =>{
        console.log("Error " + err.message);
      })
    }
  }

  function validateData()
  {
    if(game.location.length<3)
    { setErrorMessage('Game Location Is Invalide');}
    else if(game.minP < 2 || game.minP >= game.maxP || game.maxP < 3)
    { setErrorMessage('Something Wrong With Players Limitation');}
    else if(game.pitch!=='Grass'&&game.pitch!=='Sand'&&game.pitch!=='Hard'&&game.pitch!=='Inside')
    { setErrorMessage('Pitch Type is Invalide - Please Select From Grass/Sand/Hard/Inside');}
    else if(Community.id==='')
    { setErrorMessage('Please Select Community Host');}
    else if(game.day<1||game.day>31||game.month<1||game.month>12||game.year<2022)
    { setErrorMessage('Date or Time Is Invalide');}
    else
    { setErrorMessage('');}
  }

  function addToRes(item){
      db.collection("Community").doc(item).get().then((value) =>{
          var temp = value.data();
          setRes(res => [...res, temp]);
      })
  }
  const { ref } = usePlacesWidget({
    apiKey: 'AIzaSyCj3v9NUt16wYNDuHCin0qL1Eln5Ig_23o',
    onPlaceSelected: (place) => console.log(place)
  })
  /*
  const { ref } = usePlacesWidget({
    apiKey: ,
    onPlaceSelected: (place) => {
      console.log(place);
    },
    options: {
      types: ["(places)"],
      componentRestrictions: { country: "il" },
    },
  });
*/
   

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
        <h1>Game Data</h1>
        {<label>{errorMessage}</label>}
        
        <form onSubmit={addDoc}>
            <div className="div1">
              <label>Location</label><input className='loc' type='text' name='location' value={game.location} onChange={handleChange} placeholder="City" />
              <label className='pitchy'/>Pitch<input className="pit" type='text' name='pitch' value={game.pitch} onChange={handleChange} placeholder="Grass/Sand/Hard/Inside" />
            </div><br/><hr/>

            <div className="div2">
              <label className='minplay'/>Min Players<input className="minPl" type='number' name='minP' value={game.minP} onChange={handleChange}/>
              <label className="maxplaylabel"/>Max Players<input className='maxPl' type='number' name='maxP' value={game.maxP} onChange={handleChange} />
            </div><br/><hr/>
            
            <div className="div3">
               <label>Team's Size</label><input className="team_size" type='number' name='teamSize' value={game.teamSize} onChange={handleChange} />
               <label className="timeofgamelabel"/>Time Of Game<input className="game_time" type='text' name='time' value={game.time} onChange={handleChange} placeholder="hh:mm" />
            </div><br/><hr/>
            
            <div className="div4">
              <label className="daylabel">Day</label><input className="dayinput" type='number' name='day' value={game.day} onChange={handleChange}/>
              <label className="monthlabel"/>Month<input className="monthinput" type='number' name='month' value={game.month} onChange={handleChange}/>
              <label className="yearlabel"/>Year<input className="yearinput" type='number' name='year' value={game.year} onChange={handleChange} />
            </div><br/><hr/>
            
            <div>
              <br/>
                <select value={Community.id} onChange={handleSelect("id")}>
                <option value="" key="blank">Choose Community</option>
                {res.map(comm => (
                  <option value={comm.Community_ID} key={comm.Community_ID}>{comm.Name}</option>
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