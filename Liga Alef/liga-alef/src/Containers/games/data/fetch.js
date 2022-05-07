import React, { useState } from "react";
import db from "../firebaseStorage";
import { getUserId } from "../../../Context/AuthContext";
import Alert from 'react-bootstrap/Alert';
import Button from "react-bootstrap/Button";
import firebase from 'firebase/compat/app';

function Fetch(){
    var fields, games;
    const [allDocs, setAllDocs] = useState([]);
    const [gamesList, setGamesList] = useState([]);
    const [Community, setCommunity] = useState({id: "", name:""});
    const [arr, setArr] = useState([]);
    const [gamesArr, setGamesArr] = useState([]);
    const [res, setRes] = useState([]);
    const [show, setShow] = useState(false);
    const [players, setPlayers] = useState([]);


var temp;
    const handleSelect = (key) => (event) => {
        event.preventDefault();
      setCommunity({ [key]: event.target.value });
      db.collection("Community").doc(event.target.value).get().then((value) => {
        fields = value.data();
        setCommunity({id:event.target.value, name:fields.Name});
        })
      };

    
    function fetchMyGames(e){
        e.preventDefault();

        db.collection("Games").get().then((snapshot)=>{
            if(snapshot.docs.length>0){
                snapshot.docs.forEach((doc)=>{
                    temp = doc.get("Players");
                    if(temp.includes(getUserId())){
                    setAllDocs((prev)=>{
                        return[...prev,doc.data()];
                    });}
                });
            }
        });
        console.log(allDocs);
    }

    function fetchAll(e){
        e.preventDefault();
        db.collection("Games").get().then((snapshot)=>{
            if(snapshot.docs.length>0){
                snapshot.docs.forEach((doc)=>{
                    setAllDocs((prev)=>{
                        return[...prev,doc.data()];
                    });
                });
            }
        });
        console.log(allDocs);
    }

    function fetchSingle(e){
        e.preventDefault();
        db.collection("Community").doc(Community.id).get().then((snapshot)=>{
            if(snapshot){
                games = snapshot.data();
                games = games.ActiveGames;
                setGamesArr(games);
            }
        });
    }

    function clearList(e){
        e.preventDefault();
        setAllDocs([]);
        setPlayers([]);

    }

    function GetCommunities(){
        db.collection("Users").doc(getUserId()).get().then((value) => {
           fields = value.data();
           fields = fields.Communities;
           setArr(fields);
        });
        }

        function GetGames(){
            db.collection("Community").doc(Community.id).get().then((snapshot)=>{
                if(snapshot){
                    games = snapshot.data();
                    games = games.ActiveGames;
                    setGamesArr(games);
                }
            })
        }
      
        function addToRes(item){
            db.collection("Community").doc(item).get().then((value) =>{
                var temp = value.data();
                setRes(res => [...res, temp]);
            })
        }
      
        function fetchComm(e){
          e.preventDefault();
          GetCommunities();
          setRes([]);
          for(const i in arr){
              addToRes(arr[i]);
              } 
          }

          function fetchGames(e){
              e.preventDefault();
              GetGames();
              setGamesList([]);
              for(const i in gamesArr){
                addGamelist(gamesArr[i]);
              }
          }

          function addGamelist(item){
            db.collection("Games").doc(item).get().then((value) =>{
                var temp = value.data();
                setGamesList(gamesList => [...gamesList, temp]);
            })
          }

          const joinGame = (gameId) => (event) =>{
            event.preventDefault();
            var ref = db.collection("Games").doc(gameId);
            ref.update({Players: firebase.firestore.FieldValue.arrayUnion(getUserId())});
            setShow(true);
            setAllDocs([]);
        }

        const jumpTo = (gameId) => (event) =>{
            event.preventDefault();
            setAllDocs([]);
            db.collection("Games").doc(gameId).get().then((snapshot)=>{
                if(snapshot){
                    var temp = snapshot.data();
                    setAllDocs(allDocs => [...allDocs, temp]);
                    temp = temp.Players;
                    temp.forEach((player)=>{
                        db.collection("Users").doc(player).get().then((value) => {
                            setPlayers((prev)=>{
                                return[...prev,value.data()];
                            });
                         });
                    });
                }
            }); 
        }

    return(
        <>
        <div>
            <h1>Games</h1>
            <Alert show={show} variant="success">
                <Alert.Heading>You Join Game Successfully</Alert.Heading>
                    <p>Enjoy</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                    <Button onClick={() => setShow(false)} variant="outline-success">Ok!</Button>
                    </div>
                </Alert>
            <button onClick={fetchMyGames}>Show My Games</button>    
            <button onClick={fetchAll}>Show All Games</button>
            <button onClick={clearList}>Clear</button>
            <div>
                {
                    players.map((player)=>(
                        <>
                            <option>Player Name: {player.Name}</option>
                        </>
                        )
                    )
                }
                    <br />
                {
                    allDocs.map((doc)=>(
                            <>
                                <option>Game Location: {doc.Location}</option>
                                <option>Min Players To Play: {doc.minP}</option>
                                <option>Players: {doc.Players.length}/{doc.maxP}</option>
                                <option>Pitch Type: {doc.Pitch}</option>
                                <option>Date: {doc.Date.Day}.{doc.Date.Month}.{doc.Date.Year}</option>
                                <option>Time: {doc.Time}</option>
                                <button onClick={joinGame(doc.Gid)}>Check In</button>
                                <button>Waze</button>
                                <button>Sync</button>
                                <button>Weather</button>
                                <button onClick={jumpTo(doc.Gid)}>Grouping</button>
                                <br />
                            </>
                        )
                    )
                }
            </div>
        </div>
        <br /><br />
        <form onSubmit={fetchGames}>

            <button onClick={fetchComm}>Click me twice before select Community and then save</button>
            <div>
                <select value={Community.id} onChange={handleSelect("id")}>
                <option value="">All Communities</option>
                {res.map(option => (
                  <option value={option.Community_ID} key={option.id}>{option.Name}</option>
                ))}
              </select>
            </div>
            <button>Show All Community Games</button>
            <div>
            {
                    gamesList.map((doc)=>(
                            <div>
                                <option>{doc.Location}</option>
                                <option>{doc.minP}</option>
                                <option>{doc.Players.length}/{doc.maxP}</option>
                                <option>{doc.Teams}</option>
                                <option>{doc.Pitch}</option>
                                <option>{doc.Date.Day}.{doc.Date.Month}.{doc.Date.Year}</option>
                                <option>{doc.Time}</option>
                                <br />
                            </div>
                        )
                    )
                }
            </div>
        </form>
        </>
    )
}

export default Fetch;