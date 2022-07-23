import React, { useState } from "react";
import db from "../firebaseStorage";
import { getUserId } from "../../../Context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import firebase from "firebase/compat/app";

const FetchMyGame = () => {
  const [allDocs, setAllDocs] = useState([]);
  const [show, setShow] = useState(false);
  const [wait, setWait] = useState(false);
  const [problem, setProblem] = useState(false);
  const [tempPlayer, setTempPlayer] = useState([]);
  const [players, setPlayers] = useState([]);

  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);
  const [group3, setGroup3] = useState([]);
  const [group4, setGroup4] = useState([]);
  const [group5, setGroup5] = useState([]);

  function fetchMyGames(e) {
    e.preventDefault();

    clearList(e);
    db.collection("Games")
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          snapshot.docs.forEach((doc) => {
            var temp = doc.get("Players");
            if (temp.includes(getUserId())) {
              setAllDocs((prev) => {
                return [...prev, doc.data()];
              });
            }
          });
        }
      });
  }

  function fetchAll(e) {
    e.preventDefault();

    clearList(e);
    db.collection("Games")
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          snapshot.docs.forEach((doc) => {
            setAllDocs((prev) => {
              return [...prev, doc.data()];
            });
          });
        }
      });
  }

  function clearList(e) {
    e.preventDefault();
    setAllDocs([]);
    setPlayers([]);
    setTempPlayer([]);

    setGroup1([]);
    setGroup2([]);
    setGroup3([]);
    setGroup4([]);
    setGroup5([]);
  }

  const gameManage = (gameId) => (event) => {
    event.preventDefault();
    var ref = db.collection("Games").doc(gameId);
    ref.get().then((snapshot)=>{
      var playersList = snapshot.data();
      playersList=playersList.Players;
      if(playersList.find((player)=>player===getUserId())){
        console.log('Hello');
        ref.update({
          Players: firebase.firestore.FieldValue.arrayRemove(getUserId()),
        });
      }
      else{
      playersList = snapshot.data();
      playersList = playersList.Players.length;
      var maxPlayers = snapshot.data();
      maxPlayers = maxPlayers.maxP;
      if(playersList>=maxPlayers)
      { setWait(true);
        ref.update({
          Waiting: firebase.firestore.FieldValue.arrayUnion(getUserId()),
        });}
      else
      { setShow(true);
        ref.update({
          Players: firebase.firestore.FieldValue.arrayUnion(getUserId()),
        });}
      }
    })
    setAllDocs([]);
  };

  function tempFunc()
  {
    for (const k in players){
      tempPlayer.push({name:players[k].Name, id:players[k].User_ID, grade: (players[k].Grades.Soccer/players[k].Grades.SoccerVotes)});
    }
    tempPlayer.sort((a,b)=>b.grade-a.grade);
    while(tempPlayer.length > 0)
    {
      for(var i = 1; i <= 4; i++)
      {
        switch(i){
          case 1:
            group1.push(tempPlayer.pop());
            break;
          case 2:
            group2.push(tempPlayer.pop());
            break;
          case 3:
            group3.push(tempPlayer.pop());
            break;
          case 4:
            group4.push(tempPlayer.pop());
            break;
      }
     }
    }
  }
  

  const gameMembers = (gameId) => (event) => {
    event.preventDefault();
    clearList(event);

    db.collection("Games")
      .doc(gameId)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          var game = snapshot.data();
          setAllDocs((allDocs) => [...allDocs, game]);
          var temp = game.Players;
          temp.forEach((player) => {
            db.collection("Users")
              .doc(player)
              .get()
              .then((player) => {
                setPlayers((prev) => {
                  return [...prev, player.data()];
                });
              });
          });
        }
      });
      tempFunc();
  };

  return (
    <>
      <div>
        <h1>Games</h1>
        <Alert show={show} variant="success">
          <Alert.Heading>You Join Game Successfully</Alert.Heading>
          <p>Enjoy</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShow(false)} variant="outline-success">
              Ok!
            </Button>
          </div>
        </Alert>
        <Alert show={wait} variant="warning">
          <Alert.Heading>You on Waiting List For This Game</Alert.Heading>
          <p>We Let You Know When Will Be A Place For You</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => setWait(false)} variant="outline-success">
              Ok!
            </Button>
          </div>
        </Alert>
        <Alert show={problem} variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>Error</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => setProblem(false)} variant="outline-success">
              Ok!
            </Button>
          </div>
        </Alert>
        <button onClick={fetchMyGames}>Show My Games</button>
        <button onClick={fetchAll}>Show All Games</button>
        <button onClick={clearList}>Clear</button>
        <div>
          {players.map((player) => (
            <>
              <option>Player Name: {player.Name}</option>
            </>
          ))}
          <br />
          {allDocs.map((doc) => (
            <>
              <option>Game Location: {doc.Location}</option>
              <option>Min Players To Play: {doc.minP}</option>
              <option>
                Players: {doc.Players.length}/{doc.maxP}
              </option>
              <option>Pitch Type: {doc.Pitch}</option>
              <option>
                Date: {doc.Date.Day}.{doc.Date.Month}.{doc.Date.Year}
              </option>
              <option>Time: {doc.Time}</option>
              <button onClick={gameManage(doc.Gid)} 
                    disabled={(doc.Players.length>=doc.maxP)&&!doc.Players.find((obj)=>obj===getUserId())}>
                      {doc.Players.find((obj)=>obj===getUserId()) ? 'Cancel': 'Check In'}</button>
              <button onClick={gameManage(doc.Gid)} disabled={!(doc.Players.length>=doc.maxP)||doc.Players.find((obj)=>obj===getUserId())}>Waiting List</button>
              <button>Waze</button>
              <button>Sync</button>
              <button>Weather</button>
              <button onClick={gameMembers(doc.Gid)}>Grouping</button>
              <br />
            </>
          ))}
        </div>
      </div>
    </>
  )
}

export default FetchMyGame;
