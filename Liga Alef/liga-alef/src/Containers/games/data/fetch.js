import React, { useState } from "react";
import db from "../firebaseStorage";
import { getUserId } from "../../../Context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import firebase from "firebase/compat/app";

function Fetch() {
  var fields, games;
  const [gamesList, setGamesList] = useState([]);
  const [Community, setCommunity] = useState({ id: "", name: "" });
  const [arr, setArr] = useState([]);
  const [gamesArr, setGamesArr] = useState([]);
  const [res, setRes] = useState([]);
  const [show, setShow] = useState(false);

  const handleSelect = (key) => (event) => {
    event.preventDefault();
    setCommunity({ [key]: event.target.value });
    db.collection("Community")
      .doc(event.target.value)
      .get()
      .then((value) => {
        fields = value.data();
        setCommunity({ id: event.target.value, name: fields.Name });
      });
  };

  function GetCommunities() {
    db.collection("Users")
      .doc(getUserId())
      .get()
      .then((value) => {
        fields = value.data();
        fields = fields.Communities;
        setArr(fields);
      });
  }

  function GetGames() {
    db.collection("Community")
      .doc(Community.id)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          games = snapshot.data();
          games = games.ActiveGames;
          setGamesArr(games);
        }
      });
  }

  function addToRes(item) {
    db.collection("Community")
      .doc(item)
      .get()
      .then((value) => {
        var temp = value.data();
        setRes((res) => [...res, temp]);
      });
  }

  function fetchComm(e) {
    e.preventDefault();
    GetCommunities();
    setRes([]);
    for (const i in arr) {
      addToRes(arr[i]);
    }
  }

  function fetchGames(e) {
    e.preventDefault();
    GetGames();
    setGamesList([]);
    for (const i in gamesArr) {
      addGamelist(gamesArr[i]);
    }
  }

  function addGamelist(item) {
    db.collection("Games")
      .doc(item)
      .get()
      .then((value) => {
        var temp = value.data();
        setGamesList((gamesList) => [...gamesList, temp]);
      });
  }

  const joinGame = (gameId) => (event) => {
    event.preventDefault();
    var ref = db.collection("Games").doc(gameId);
    ref.update({
      Players: firebase.firestore.FieldValue.arrayUnion(getUserId()),
    });
    setShow(true);
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
      </div>
      <form onSubmit={fetchGames}>
        <button onClick={fetchComm}>
          Click me twice before select Community and then save
        </button>
        <div>
          <select value={Community.id} onChange={handleSelect("id")}>
            <option value="">All Communities</option>
            {res.map((option) => (
              <option value={option.Community_ID} key={option.id}>
                {option.Name}
              </option>
            ))}
          </select>
        </div>
        <button>Show All Community Games</button>
        <div>
          {gamesList.map((doc) => (
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
              <button onClick={joinGame(doc.Gid)}>Check In</button>
              <button>Waze</button>
              <button>Sync</button>
              <button>Weather</button>
              <br />
            </>
          ))}
        </div>
      </form>
    </>
  );
}

export default Fetch;
