import React, {useState} from 'react';
import "../communities.css";
import { getUserId } from '../../../Context/AuthContext';
import db from '../../games/firebaseStorage';

const Members = (props) => {
    var fields, grade;
    const [res, setRes] = useState([]);
    const [arr, setArr] = useState([]);
    const [members, setMembers] = useState([]);
    const [Community, setCommunity] = useState({id: "", name:""});
    
    const handleChange = (event) =>{
        event.preventDefault();

        grade = event.target.value;
      };

    const handleSelect = (key) => (event) => {
        event.preventDefault();
      setCommunity({ [key]: event.target.value });
      db.collection("Community").doc(event.target.value).get().then((value) => {
        fields = value.data();
        setCommunity({id:event.target.value, name:fields.Name});
        })
      };

    const updateGrade = (userId) => (event) => {
    event.preventDefault();

    var ref = db.collection("Users").doc(userId);
    ref.update({'Grades.Soccer': grade})
    }

    function GetCommunities(){
    db.collection("Users").doc(getUserId()).get().then((value) => {
        fields = value.data();
        fields = fields.Communities;
        setArr(fields);
    });
    }
    
    function addToRes(item){
        db.collection("Community").doc(item).get().then((value) =>{
            var temp = value.data();
            setRes(res => [...res, temp]);
        })
    }
    
    function fetchAll(e){
        e.preventDefault();
        GetCommunities();
        setRes([]);
        for(const i in arr){
            addToRes(arr[i]);
            } 
    }

    const jumpTo = () => (event) =>{
        event.preventDefault();

        setMembers([]);
        db.collection("Community").doc(props.cid).get().then((snapshot)=>{
            if(snapshot){
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
    }

    return(
        <>
            <div>
                <button onClick={jumpTo()}>Show Community Members</button>
            {
                members.map((member)=>(
                        <>
                            <option>Name: {member.Name}</option>
                            <option>Grade: {member.Grades.Soccer}</option>
                            <form onSubmit={updateGrade(member.User_ID)}>
                                <input type='text' name='memberGrade' value={grade} onChange={handleChange} placeholder="New Grade" /><br />
                                <button>Save Game</button>
                            </form>
                        </>
                        )
                    )
                }
            </div>
        </>
    )
}

export default Members;
