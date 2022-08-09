import React, { useState, useEffect, useRef } from "react";
import db from "../firebaseStorage";
import { getUserId, getUserName } from "../../../Context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import firebase from "firebase/compat/app";


import emailjs from "emailjs-com";
//import emailjs from '@emailjs/browser';

const FetchMyGame = () => {
  const form = useRef();
  const [waitUser, setWaitUser] = useState({name: '', email:''});
  const [allDocs, setAllDocs] = useState([]);
  const [show, setShow] = useState(false);
  const [wait, setWait] = useState(false);
  const [problem, setProblem] = useState(false);
  const [secondChance, setSecondChance] = useState(false);
  const [game_ID, setGameID] = useState();
  const [tempPlayer, setTempPlayer] = useState([]);
  const [players, setPlayers] = useState([]);

  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);
  const [group3, setGroup3] = useState([]);
  const [group4, setGroup4] = useState([]);
  const [group5, setGroup5] = useState([]);

  useEffect(() => {
    fetchMyGames();
  }, [])

  function fetchMyGames() {
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

    fetchMyGames();

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
        }
        else{
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
        }
    })
    setAllDocs([]);
  };

  const updateGameList = (e) => {
    e.preventDefault();

    var ref = db.collection("Games").doc(game_ID);
    ref.update({
      Players: firebase.firestore.FieldValue.arrayRemove(getUserId()),
    });
    ref.get().then((snapshot)=>{
      var waitingList = snapshot.data();
      waitingList = waitingList.Waiting;
      if(waitingList.length>0)
      {
        ref.update({
          Waiting: firebase.firestore.FieldValue.arrayRemove(waitingList[0]),
          Players: firebase.firestore.FieldValue.arrayUnion(waitingList[0]),
        });

        //sent E-Mail
        //form.current.user_name.value=getWaitingEmail(waitingList[0]);
        //form.current.user_email.value=getWaitingEmail(waitingList[0]);
        db.collection("Users").doc(waitingList[0]).get().then((obj)=>{
          var user = obj.data();
          setWaitUser({name: user.Name, email: user.Email});
        });
        form.current.user_name.value = 'User';
        //form.current.user_name.value = waitUser.name;
        form.current.user_email.value="Mosheam@mta.ac.il";
        //form.current.user_email.value=waitUser.email;
        var gameData = snapshot.data();
        var commName = snapshot.data();
        commName = commName.Community;
        form.current.community.value=commName.Name;
        gameData = gameData.Date.Day +'/'+gameData.Date.Month+' - '+gameData.Location;
        form.current.message.value = gameData;

        emailjs.sendForm('LigaAlef_Support', 'WaitingList_oyr0yho', form.current, 'O_-YESL-F2_dMebuX')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
      }
    });
    setSecondChance(false)
    clearList(e);
  }

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
          case 5:
            group5.push(tempPlayer.pop());
            break;
          default:
            group1.push(tempPlayer.pop());
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

  async function getWeather(doc){
    const date = doc.Date.Year + "-" + doc.Date.Month + "-" + doc.Date.Day ;
    const location = doc.Location + ",IL/";
    const apiKey = '5HG66BJ3CW2HAE34GRAUEA3G2';
    const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + date + "?key=" + apiKey;
    console.log(url);
    var response = await fetch(url).then(
      response => response.text() // .json(), .blob(), etc.
    ).then(
      text => console.log(text) // Handle here
    );
    //var res = response.responseText;
    
    //console.log(response);
   // console.log(res);
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
          <form ref={form} onSubmit={updateGameList}>
            <input type="hidden" name="user_name" />
            <input type="hidden" name="community" />
            <input type="hidden" name="user_email" />
            <input type="hidden" name="message" />
            <input type="submit" value="I'm Sure" />
          </form>
            <Button onClick={() => setSecondChance(false)} variant="outline-success">You Right! I Want To Stay In</Button>
          </div>
        </Alert>
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
              {(doc.Waiting.length>0)&&(<option> There Are {doc.Waiting.length} on the waiting list</option>)}
              <option>Pitch Type: {doc.Pitch}</option>
              <option>
                Date: {doc.Date.Day}.{doc.Date.Month}.{doc.Date.Year}
              </option>
              <option>Time: {doc.Time}</option>
              <button onClick={gameManage(doc.Gid)} 
                    disabled={(doc.Players.length>=doc.maxP)&&!doc.Players.find((obj)=>obj===getUserId())}>
                      {doc.Players.find((obj)=>obj===getUserId()) ? 'Cancel Check In': 'Check In'}</button>
              <button onClick={gameManage(doc.Gid)} 
                    disabled={!(doc.Players.length>=doc.maxP)||doc.Players.find((obj)=>obj===getUserId())}>
                       {doc.Waiting.find((obj)=>obj===getUserId()) ? 'Cancel Waiting': 'Waiting List'}</button>
              <button>Waze</button>
              <button>Sync</button>
              <button onClick={async () => {await getWeather(doc);}}>Weather</button>
              <button onClick={gameMembers(doc.Gid)}>Grouping</button>
              <br />
            </>
          ))}
          <br /><br />
          <button onClick={clearList}>Back</button>
          <button onClick={fetchMyGames}>Temp - Show My Games</button>
          <button onClick={fetchAll}>Temp -Show All Games</button>

        </div>
      </div>
    </>
  )
}

export default FetchMyGame;

