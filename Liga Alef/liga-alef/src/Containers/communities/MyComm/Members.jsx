import React, {useEffect, useState} from 'react';
import "../communities.css";
import db from '../../games/firebaseStorage';
import { getUserId } from '../../../Context/AuthContext';

const Members = (props) => {
    var commType = 'Soccer';
    const [members, setMembers] = useState([]);
    const [voted, setVoted] = useState([]);
    
    useEffect(() => {
        db.collection("Users").doc(getUserId()).get().then((blockDouble) => {
            var Voted = blockDouble.data();
            Voted = Voted.Grades;
            Voted = Voted.Voted;

            setVoted([]);
            setMembers([]);
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
                oldGrade = oldGrade.Soccer;
                var grade = parseFloat(oldGrade) + parseFloat(value);
                ref.update({"Grades.Soccer": grade});
            });

        var oldVotes = ref.get().then((snapshot) => 
            {
                oldVotes = snapshot.data();
                oldVotes = oldVotes.Grades;
                oldVotes = oldVotes.SoccerVotes;
                if(value)
                {
                    oldVotes++;
                    ref.update({"Grades.SoccerVotes": oldVotes});
                    setVoted((prev) => [...prev, userID]);
                    db.collection("Users").doc(getUserId()).update({"Grades.Voted": true});
                }
            });
    }

    function checkVoted(user_Id){
        for (const i in voted) {
            if(voted[i] === user_Id)
                {return true;}
        }
        return false;
    }

    const fetchAll = () => (event) =>{
        event.preventDefault();

        db.collection("Users").doc(getUserId()).get().then((blockDouble) => {
            var Voted = blockDouble.data();
            Voted = Voted.Grades;
            Voted = Voted.Voted;

            setVoted([]);
            setMembers([]);
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
    }

    const getTypeComm = () => (event) => {
        event.preventDefault();
        commType = db.collection("Community").doc(props.cid).get();

        console.log("test");
        console.log(commType);
    }

    return(
        <>
            <div>
                {
                    members&&(members.map((member)=>(
                        <>
                            <option>Name: {member.Name}</option>
                            <option>Grade: {parseInt(member.Grades.Soccer/member.Grades.SoccerVotes)}</option>
                            <div>
                                <select value="" disabled={checkVoted(member.User_ID)} onChange={updateGrade(member.User_ID)}>
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

export default Members;
