import React, {useState} from 'react';
import "../communities.css";
import db from '../../games/firebaseStorage';

const Members = (props) => {
    var grade;
    const [members, setMembers] = useState([]);
    
    const handleChange = (event) =>{
        event.preventDefault();

        grade = event.target.value;
      };

    const updateGrade = (userId) => (event) => {
    event.preventDefault();

    var ref = db.collection("Users").doc(userId);
    ref.update({'Grades.Soccer': grade})
    }


    const fetchAll = () => (event) =>{
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
                <button onClick={fetchAll()}>Show Community Members</button>
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
