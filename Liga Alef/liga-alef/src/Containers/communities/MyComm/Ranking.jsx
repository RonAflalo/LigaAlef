import React, {useEffect, useState} from 'react';
import "../communities.css";
import db from '../../games/firebaseStorage';
import { getUserId } from '../../../Context/AuthContext';
import Alert from "react-bootstrap/Alert";

const Ranking = (props) => {
    const [gameLList, setGameList] = useState([]);
    const [commType, setCommType] = useState('Soccer');
    const [show, setShow] = useState(false);
    const [members, setMembers] = useState([]);
    const [voted, setVoted] = useState([]);
    
    useEffect(() => {
        db.collection("Users").doc(getUserId()).get().then((blockDouble) => {
            setVoted([]);
            setMembers([]);
            setShow(Voted);
            setVoted((prev) => [...prev, getUserId()]);

            getGamesList();
            getTypeComm();
            voted.push(getUserId());
            
            var Voted = blockDouble.data();
            Voted = Voted.Grades;
            Voted = Voted.Voted;

            db.collection("Community").doc(props.cid).get().then((snapshot)=>{
                if(snapshot && !Voted){
                    var temp = snapshot.data();
                    temp = temp.Members;
                    temp.forEach((member)=>{
                        db.collection("Users").doc(member).get().then((value) => {
                            setMembers((prev)=>{
                                return[...prev,value.data()];
                            });
                        });
                    });
                }
            });
        }); 
    }, [])

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

                if(value)
                {
                    //oldVotes++;
                    //ref.update({voteString: oldVotes});
                    setVoted((prev) => [...prev, userID]);
                    db.collection("Users").doc(getUserId()).update({"Grades.Voted": true});
                }
            });
    }

    function disableVotedUsers(user_Id){
        for (const i in voted) {
            if(voted[i] === user_Id)
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
                {
                    members&&(members.map((member)=>(
                        <>
                            <option key="member.Name">Name: {member.Name}</option>
                            <option key="member.Grades.Soccer">Soccer Grade: {parseInt(member.Grades.Soccer/member.Grades.SoccerVotes)}</option>
                            <option key="member.Grades.Basketball">BasketBall Grade: {parseInt(member.Grades.Basketball/member.Grades.BasketballVotes)}</option>
                            <option key="member.Grades.Volyball">VolyBall Grade: {parseInt(member.Grades.Volyball/member.Grades.SoccerVotes)}</option>
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
                {
                    gameLList.map((game)=>(
                        <option key="game.Gid">Game ID: {game.Gid}</option>
                    ))
                }
            </div>
        </>
    )
}

export default Ranking;
