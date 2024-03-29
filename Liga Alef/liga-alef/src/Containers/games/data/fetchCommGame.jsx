import React, { useState, useEffect } from "react";
import db from "../firebaseStorage";
import { getUserId } from "../../../Context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import firebase from "firebase/compat/app";
import "./gameProps.css"

function FetchCommGame() {
  const [res, setRes] = useState([]);
  const [gamesList, setGamesList] = useState([]);
  const [commId, setCommID] = useState();
  const [show, setShow] = useState(false);
  const [wait, setWait] = useState(false);
  const [problem, setProblem] = useState(false);
  const [secondChance, setSecondChance] = useState(false);
  const [game_ID, setGameID] = useState();
  const [players, setPlayers] = useState([]);
  const [currentGameId, setCurrentGameID] = useState();
  const [currentGame, setCurrentGame] = useState([]);
  useEffect(() => {
    db.collection("Users")
      .doc(getUserId())
      .get()
      .then((value) => {
        var arr = value.data();
        arr = arr.Communities;
        for (const i in arr) {
          addToRes(arr[i]);
        }
        db.collection("Games")
        .where('Community.Id', '==', arr.pop())
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length > 0) {
            snapshot.docs.forEach((doc) => {
              setGamesList((prev) => {
                return [...prev, doc.data()];
              });
              var idNum = doc.data();
              idNum=idNum.Community;
              setCommID(idNum.Id);
            });
          }
        });
        })  
  }, [])

  function addToRes(item) {
    db.collection("Community")
      .doc(item)
      .get()
      .then((value) => {
        var temp = value.data();
        setRes((res) => [...res, temp]);
      });
  }

  const fetchCommGames = () => (event) => {
    event.preventDefault();

    setGamesList([]);
    setPlayers([]);
    setCommID(event.target.value);
    db.collection("Games")
    .where('Community.Id', '==', event.target.value)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length > 0) {
        snapshot.docs.forEach((doc) => {
          setGamesList((prev) => {
            return [...prev, doc.data()];
          });
        });
      }
    });
  }

  const gameManage = (gameId) => (event) => {
    var msg
    event.preventDefault();
    var ref = db.collection("Games").doc(gameId);
    ref.get().then((snapshot)=>{
      var playersList = snapshot.data();
      playersList=playersList.Players;
      if(playersList.find((player)=>player===getUserId())){
        setSecondChance(true);
        setGameID(gameId);
      }
      else{
        playersList = snapshot.data();
        var waitingList = playersList.Waiting;
        if(waitingList.find((player)=>player===getUserId())){
          ref.update({
            Waiting: firebase.firestore.FieldValue.arrayRemove(getUserId()),
          });

          msg = "You have cancelled waiting for ";
        }
        else{
          playersList = playersList.Players.length;
          var maxPlayers = snapshot.data();
          maxPlayers = maxPlayers.maxP;
          if(playersList>=maxPlayers)
          { setWait(true);
            ref.update({
              Waiting: firebase.firestore.FieldValue.arrayUnion(getUserId()),
            });
          
            msg = "You are on waiting list for ";
          }
          else
          { setShow(true);
            ref.update({
              Players: firebase.firestore.FieldValue.arrayUnion(getUserId()),
            });
          
            msg = "You are participating in ";
          }
          }
          console.log(msg);
          var game = snapshot.data();
          var comname = game.Community.Name;
          var location = game.Location;
          var time = game.Date.Day + "." + game.Date.Month + "." + game.Date.Year + " " + game.Time
          msg = msg + comname + "'s game at "  + location + " on " + time;
          console.log(msg);
          const data = {
            message: msg,
            time: Date.now(),
          }        
          console.log(data);
          db.collection("Users").doc(getUserId()).collection("Notifications").add({data});

        }
    })
    setGamesList([]);
  };

  function updateGameList(){
    var msg1;
    var msg2;
    var ref = db.collection("Games").doc(game_ID);
    ref.update({
      Players: firebase.firestore.FieldValue.arrayRemove(getUserId()),
    });
    ref.get().then((snapshot)=>{
      var game = snapshot.data();
      var comname = game.Community.Name;
      var location = game.Location;
      var time = game.Date.Day + "." + game.Date.Month + "." + game.Date.Year + " " + game.Time
      msg1 = "You have cancelled registration for " + comname + "'s game at "  + location + " on " + time;

      const data = {
        message: msg1,
        time: Date.now(),
      }        
      db.collection("Users").doc(getUserId()).collection("Notifications").add({data});

      var waitingList = game.Waiting;
      if(waitingList.length>0)
      {
        ref.update({
          Waiting: firebase.firestore.FieldValue.arrayRemove(waitingList[0]),
          Players: firebase.firestore.FieldValue.arrayUnion(waitingList[0]),
        });

      msg2 = "A מew spot available in " + comname + "'s game at "  + location + " on " + time+". You've been singed up!"
      const data = {
        message: msg2,
        time: Date.now(),
      }        
      db.collection("Users").doc(waitingList[0]).collection("Notifications").add({data});
      }
    });
    setSecondChance(false)
        //sent E-Mail
  }

  const gameMembers = (gameId) => (event) => {
    event.preventDefault();

  if( players.length > 0 )
  {
    setPlayers([]);
  }
  else{
    db.collection("Games")
      .doc(gameId)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          var game = snapshot.data();
          //setAllDocs((allDocs) => [...allDocs, game]);
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
    }
  };

  const fetchGame = () => (event) => {
    event.preventDefault();

    setCurrentGame([]);
    //setPlayers([]);
    setCurrentGameID(event.target.value);
    db.collection("Games")
    .where('Gid', '==', event.target.value)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length > 0) {
        snapshot.docs.forEach((doc) => {
          setCurrentGame((prev) => {
            return [...prev, doc.data()];
          });
        });
      }
    });
  }

  function clearList(e) {
    e.preventDefault();
    setGamesList([]);
    setPlayers([]);
  }

  async function getWeather(doc){
    const date = doc.Date.Year + "-" + doc.Date.Month + "-" + doc.Date.Day ;
    const location = doc.Location + ",IL/";
    const apiKey = '5HG66BJ3CW2HAE34GRAUEA3G2';
    const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + date + "?key=" + apiKey;
    console.log(url);
    var response = await fetch(url).then(
      response => response.json()
    ).then(
      json => {console.log(Object.keys(json));
      
      alert(json.days[0].description);
    }
    );
  }

  function showInMapClicked(doc) {
    const location = doc.Location;
    window.open("https://www.google.com/maps/place/"+location);
  }

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
        <Alert show={secondChance} variant="dark">
          <Alert.Heading>Are You Sure You Want To Cancel The Match Check-In?!</Alert.Heading>
          <p>We let you Second Chance To Think About It!</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => updateGameList()} variant="outline-success">I'm Sure!</Button>
            <Button onClick={() => setSecondChance(false)} variant="outline-success">You Right! I Want To Stay In</Button>
          </div>
        </Alert>
        <h5>Choose Community:</h5>
            {res.map((comm) => (
              <>
              <button className="comButton" value={comm.Community_ID} onClick={fetchCommGames()} 
                disabled={commId===comm.Community_ID}>
                {comm.Name}
                </button>
              </>
            ))}
          <div>
          <br />
          {gamesList.map((game) => (
              <>
              <button className= "gameButton" value={game.Gid} onClick={fetchGame()} 
                disabled={currentGameId===game.Gid}>
                {game.Location}
                <br />
                {game.Date.Day}.{game.Date.Month}.{game.Date.Year}
                </button>
              </>
            ))}
          <br />
          {currentGame.map((doc) => (
            <>
            <div class="props">
            <div><i class="fa-solid fa-location-dot"></i><i> : {doc.Location}</i></div>
             <div>
             <i class="fa-solid fa-person"></i><i> : {doc.Players.length}/{doc.maxP} </i>
                </div>
              {(doc.Waiting.length>0)&&(<option> There Are {doc.Waiting.length} on the waiting list</option>)}
              <div><i class="fa-solid fa-money-bill"></i><i> : {doc.Pitch}</i> </div>
              <div><i class="fa-regular fa-calendar-days"></i><i> : {doc.Date.Day}.{doc.Date.Month}.{doc.Date.Year}</i> </div>
              <div><i class="fa-regular fa-clock"></i><i> : {doc.Time}</i> </div> 
              </div>
              <button onClick={gameManage(doc.Gid)} 
                    disabled={(doc.Players.length>=doc.maxP)&&!doc.Players.find((obj)=>obj===getUserId())}>
                      {doc.Players.find((obj)=>obj===getUserId()) ? 'Cancel Check In': 'Check In'}</button>
              <button onClick={gameManage(doc.Gid)} 
                    disabled={!(doc.Players.length>=doc.maxP)||doc.Players.find((obj)=>obj===getUserId())}>
                       {doc.Waiting.find((obj)=>obj===getUserId()) ? 'Cancel Waiting': 'Waiting List'}</button>
              <button onClick={async() => showInMapClicked(doc)}>Open in maps</button>
              <button>Sync</button>
              <button onClick={async () => {await getWeather(doc);}}>Weather</button>
              <button onClick={gameMembers(doc.Gid)}>Players</button>
              <br />
            </>
          ))}
          <br />
            {players.map((player) => (
            <>
              <option>Player: {player.Name}</option>
            </>
          ))}
        </div>
      </div>
    </>
  )
}

export default FetchCommGame;
