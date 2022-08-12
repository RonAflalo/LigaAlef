import React, {useEffect, useState} from 'react';
import "../communities.css";
import db from '../../games/firebaseStorage';
import { getUserId } from '../../../Context/AuthContext';
import Alert from "react-bootstrap/Alert";
import firebase from "firebase/compat/app";

const Ranking = (props) => {
    const [gameLList, setGameList] = useState([]);
    const [commType, setCommType] = useState('Soccer');
    const [show, setShow] = useState(false);
    const [players, setPlayers] = useState([]);
    const [PlayersVoted, setVoted] = useState([]);
    const [selectedGame, setGame] = useState({id: ''});
    
    useEffect(() => {
            setVoted([]);
            setPlayers([]);
            getGamesList();
            getTypeComm();
    }, [])

    const handleSelect = (key) => (event) => {
        event.preventDefault();
        setGame({[key]: event.target.value});
        setPlayers([])
        setShow(false);

        db.collection("Games").doc(event.target.value).get().then((game)=>{
                var voated = game.data();
                voated = voated.Voated;
                if(voated.find((player)=>player===getUserId())){
                    setShow(true);
                }
                else{
                setVoted((prev) => [...prev, getUserId()]);
                var temp = game.data();
                temp = temp.Players;
                temp.forEach((player)=>{
                    db.collection("Users").doc(player).get().then((user) => {
                        setPlayers((prev)=>{
                            return[...prev,user.data()];
                        });
                    });
                });
            }
        });
      };

    const updateGrade = (userId) => (event) => {
        getOldGrade(userId, event.target.value);
    }

    function getOldGrade (userID, value){
        var ref = db.collection("Users").doc(userID);

        var oldGrade = ref.get().then((snapshot) => 
            {
                oldGrade = snapshot.data();
                oldGrade = oldGrade.Grades;

                switch(commType) {
                    case 'Soccer':
                       oldGrade = oldGrade.Soccer;
                       var grade = parseFloat(oldGrade) + parseFloat(value);
                       ref.update({'Grades.Soccer': grade});
                       break;
                    case 'Basketball':
                        oldGrade = oldGrade.Basketball;
                        //typeString = 'Grades.BasketballVotes';
                        var grade = parseFloat(oldGrade) + parseFloat(value);
                        ref.update({'Grades.Basketball': grade}); 
                      break;
                    case 'Volyball':
                        oldGrade = oldGrade.Volyball;
                        //typeString = 'Grades.VolyballVotes';
                        var grade = parseFloat(oldGrade) + parseFloat(value);
                        ref.update({'Grades.Volyball': grade}); 
                      break;
                    default:
                      console.log('Error');
                      break;
                    }
                    //var grade = parseFloat(oldGrade) + parseFloat(value);
                    //ref.update({typeString: grade});
            });

        var oldVotes = ref.get().then((snapshot) => 
            {
                oldVotes = snapshot.data();
                oldVotes = oldVotes.Grades;

                switch(commType) {
                    case 'Soccer':
                        oldVotes = oldVotes.SoccerVotes;
                        oldVotes++;
                        ref.update({"Grades.SoccerVotes": oldVotes});
                       break;
                    case 'Basketball':
                        oldVotes = oldVotes.BasketballVotes;
                        //voteString = 'Grades.Basketball'; 
                        oldVotes++;
                        ref.update({"Grades.BasketballVotes": oldVotes});
                      break;
                    case 'Volyball':
                        oldVotes = oldVotes.VolyballVotes;
                        //voteString = 'Grades.Volyball';
                        oldVotes++;
                        ref.update({"Grades.VolyballVotes": oldVotes}); 
                      break;
                    default:
                      console.log('Error');
                      break;
                    }
                    //oldVotes++;
                    //ref.update({voteString: oldVotes});
                    setVoted((prev) => [...prev, userID]);
                    db.collection("Games").doc(selectedGame.id).update({
                        Voated: firebase.firestore.FieldValue.arrayUnion(getUserId()),
                      });
            });
    }

    function disableVotedUsers(user_Id){
        for (const i in PlayersVoted) {
            if(PlayersVoted[i] === user_Id)
                {return true;}
        }
        return false;
    }

    function getTypeComm () {
            db.collection("Community").doc(props.cid).get().then((snapshot) => {
            var type = snapshot.data();
            type = type.Type;
            setCommType(type);
        })
    }

    function getGamesList(){
        var ref = db.collection("Games").where('Community.Id', '==',props.cid).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                setGameList((prev)=>[...prev,doc.data()]);
            })
        })
    }

    return(
        <>
            <Alert show={show} variant="success">
                <Alert.Heading>Thanks For Your Votes! </Alert.Heading>
                <p>See You Againg After Next Game</p>
                <hr />
            </Alert>
            <div>
                    <select value={selectedGame.id} onChange={handleSelect('id')}>
                    <option value="">Choose Game</option>
                    {gameLList.map(game => (
                    <option value={game.Gid} key={game.Gid} disabled={!game.Players.find((obj)=>obj===getUserId())}>Game On {game.Date.Day}.{game.Date.Month}.{game.Date.Year} In {game.Location}</option>
                    ))}
                    </select>
                </div>
            <div>
                {
                    players&&(players.map((member)=>(
                        <>
                            <option key="member.Name">Name: {member.Name}</option>
                            <option key="member.Grades.Soccer"> {parseInt(member.Grades.Soccer/member.Grades.SoccerVotes)}</option>
                            {(member.Grades.Basketball/member.Grades.BasketballVotes) ? <option key="member.Grades.Basketball">BasketBall Grade: {parseInt(member.Grades.Basketball/member.Grades.BasketballVotes)}</option> : ''}
                            {(member.Grades.Volyball/member.Grades.SoccerVotes) ? <option key="member.Grades.Volyball">VolyBall Grade: {parseInt(member.Grades.Volyball/member.Grades.SoccerVotes)}</option> : ''}
                            <div>
                                <select key="member.User_ID" value="" disabled={disableVotedUsers(member.User_ID)} onChange={updateGrade(member.User_ID)}>
                                    <option value={0}>Rate</option>
                                    <option value={1} key={1}>1</option>
                                    <option value={2} key={2}>2</option>
                                    <option value={3} key={3}>3</option>
                                    <option value={4} key={4}>4</option>
                                    <option value={5} key={5}>5</option>
                                </select>
                            </div>
                        </>
                        )
                    ))
                }
            </div>
        </>
    )
}

export default Ranking;
