import React, { useState, useEffect, useRef } from "react";
import db from "../firebaseStorage";
import { getUserId, getUserName } from "../../../Context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import firebase from "firebase/compat/app";
import "./gameProps.css"

import emailjs from "emailjs-com";
//import emailjs from '@emailjs/browser';

const FetchMyGame = () => {
  const formEmail = useRef();
  const [waitUser, setWaitUser] = useState({name: '', email:''});
  const [allDocs, setAllDocs] = useState([]);
  const [show, setShow] = useState(false);
  const [wait, setWait] = useState(false);
  const [problem, setProblem] = useState(false);
  const [secondChance, setSecondChance] = useState(false);
  const [game_ID, setGameID] = useState();
  const [tempPlayer, setTempPlayer] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentGameId, setCurrentGameID] = useState();
  const [currentGame, setCurrentGame] = useState([]);

  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);
  const [group3, setGroup3] = useState([]);
  const [group4, setGroup4] = useState([]);
  const [group5, setGroup5] = useState([]);

  const [teamSize, setTeamSize] = useState();
  const [maxPlayers, setMaxPlayers] = useState();

  useEffect(() => {
    fetchMyGames();
  }, [])

  function fetchMyGames() {
    setSecondChance(false);
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
        var msg;
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

          var game = snapshot.data();
          var comname = game.Community.Name;
          var location = game.Location;
          var time = game.Date.Day + "." + game.Date.Month + "." + game.Date.Year + " " + game.Time
          msg = msg + comname + "'s game at "  + location + " on " + time;
          
          const data = {
            message: msg,
            time: Date.now(),
          }        
          db.collection("Users").doc(getUserId()).collection("Notifications").add({data});
        }
    })
    setAllDocs([]);
  };

  const updateGameList = (e) => {
    e.preventDefault();
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

      msg2 = "A new spot available in " + comname + "'s game at "  + location + " on " + time+". You've been singed up!"
      const data = {
        message: msg2,
        time: Date.now(),
      }        
      db.collection("Users").doc(waitingList[0]).collection("Notifications").add({data});

        //sent E-Mail
        //form.current.user_name.value=getWaitingEmail(waitingList[0]);
        //form.current.user_email.value=getWaitingEmail(waitingList[0]);
        db.collection("Users").doc(waitingList[0]).get().then((obj)=>{
          var user = obj.data();
          setWaitUser({name: user.Name, email: user.Email});
        });
        formEmail.current.user_name.value = 'User';
        //form.current.user_name.value = waitUser.name;
        formEmail.current.user_email.value="Mosheam@mta.ac.il";
        //form.current.user_email.value=waitUser.email;
        var gameData = snapshot.data();
        var commName = snapshot.data();
        commName = commName.Community;
        formEmail.current.community.value=commName.Name;
        gameData = gameData.Date.Day +'/'+gameData.Date.Month+' - '+gameData.Location;
        formEmail.current.message.value = gameData;

        console.log("hello");

        emailjs.sendForm('LigaAlef_Support', 'WaitingList_oyr0yho', formEmail.current, 'O_-YESL-F2_dMebuX')
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

  function tempFunc(gameId)
  {
    var ref = db.collection("Games").doc(gameId);

    ref.get().then((snapshot)=>{
      var game = snapshot.data();
      setMaxPlayers(game.maxP);
      setTeamSize(game.TeamSize);
      })
      
    for (const k in players){
      tempPlayer.push({name:players[k].Name, id:players[k].User_ID, grade: (players[k].Grades.Soccer/players[k].Grades.SoccerVotes)});
    }
    tempPlayer.sort((a,b)=>a.grade-b.grade);
    var back = false;
    while(tempPlayer.length > 0)
    {
      if (!back){
        for(var i = 1; i <= (maxPlayers/teamSize); i++)
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
        back = true;
       }
      }
      else{
        for(var i = 6-(maxPlayers/teamSize); i <= 5; i++)
        {
          switch(i){
            case 1:
              group5.push(tempPlayer.pop());
              break;
            case 2:
              group4.push(tempPlayer.pop());
              break;
            case 3:
              group3.push(tempPlayer.pop());
              break;
            case 4:
              group2.push(tempPlayer.pop());
              break;
            case 5:
              group1.push(tempPlayer.pop());
              break;
            default:
              group1.push(tempPlayer.pop());
              break;
        }
        back = false;
       }
      }
    }
  }

  const gameMembers = (gameId) => (event) => {
    event.preventDefault();
    setAllDocs([]);
    setPlayers([]);

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
      tempFunc(gameId);
  };

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
    <head>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        rel="stylesheet"
        />
    </head>
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
          <form ref={formEmail} onSubmit={updateGameList}>
            <input type="hidden" name="user_name"/>
            <input type="hidden" name="community" />
            <input type="hidden" name="user_email" />
            <input type="hidden" name="message" />
            <input type="submit" value="I'm Sure" />
          </form>
            <Button onClick={() => fetchMyGames()} variant="outline-success">You Right! I Want To Stay In</Button>
          </div>
        </Alert>
        <div>
          {group1.map((player) => (
            <>
              <option>Group 1 Player Name: {(player ? player.name : 'None')} {(player ? parseInt(player.grade) : '0')}</option>
            </>
          ))}
          {group1.length>0 ? <br /> : ''}
          {group2.map((player) => (
            <>
              <option>Group 2 Player Name: {(player ? player.name : 'None')} {(player ? parseInt(player.grade) : '0')}</option>
            </>
          ))}
          {group2.length>0 ? <br /> : ''}
          {group3.map((player) => (
            <>
              <option>Group 3 Player Name: {(player ? player.name : 'None')} {(player ? parseInt(player.grade) : '0')}</option>
            </>
          ))}
          {group3.length>0 ? <br /> : ''}
          {group4.map((player) => (
            <>
              <option>Group 4 Player Name: {(player ? player.name : 'None')} {(player ? parseInt(player.grade) : '0')}</option>
            </>
          ))}
          {group4.length>0 ? <br /> : ''}
          {group5.map((player) => (
            <>
              <option>Group 4 Player Name: {(player ? player.name : 'None')} {(player ? parseInt(player.grade) : '0')}</option>
            </>
          ))}
          {group5.length>0 ? <br /> : ''}
          <br />
          {allDocs.map((game) => (
              <>
              <button className="heyhey" value={game.Gid} onClick={fetchGame()} 
                disabled={currentGameId===game.Gid}>
                {game.Location}
                <br />
                {game.Date.Day}.{game.Date.Month}.{game.Date.Year}
                </button>
              </>
            ))}
          <br />
          {!(group1.length>0)&&currentGame.map((doc) => (
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
              <button onClick={gameMembers(doc.Gid)}>Grouping</button>
              <br />
            </>
          ))}
          <br /><br />
          <button onClick={clearList} disabled={!(group1.length>0)}>Back</button>

        </div>
      </div>
    </>
  )
}

export default FetchMyGame;

