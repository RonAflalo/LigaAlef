import React, { useState } from "react";
import db from "../firebaseStorage";
import { getUserId } from "../../../Context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import firebase from "firebase/compat/app";

function FetchMyGame() {
  const [allDocs, setAllDocs] = useState([]);
  const [show, setShow] = useState(false);
  const [players, setPlayers] = useState([]);

  var temp;

  function fetchMyGames(e) {
    e.preventDefault();

    db.collection("Games")
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          snapshot.docs.forEach((doc) => {
            temp = doc.get("Players");
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

    setAllDocs([]);
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
  }

  const joinGame = (gameId) => (event) => {
    event.preventDefault();
    var ref = db.collection("Games").doc(gameId);
    ref.update({
      Players: firebase.firestore.FieldValue.arrayUnion(getUserId()),
    });
    setShow(true);
    setAllDocs([]);
  };

  const jumpTo = (gameId) => (event) => {
    event.preventDefault();
    setAllDocs([]);
    db.collection("Games")
      .doc(gameId)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          var temp = snapshot.data();
          setAllDocs((allDocs) => [...allDocs, temp]);
          temp = temp.Players;
          temp.forEach((player) => {
            db.collection("Users")
              .doc(player)
              .get()
              .then((value) => {
                setPlayers((prev) => {
                  return [...prev, value.data()];
                });
              });
          });
        }
      });
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
              <button onClick={joinGame(doc.Gid)}>Check In</button>
              <button>Waze</button>
              <button>Sync</button>
              <button>Weather</button>
              <button onClick={jumpTo(doc.Gid)}>Grouping</button>
              <br />
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default FetchMyGame;
