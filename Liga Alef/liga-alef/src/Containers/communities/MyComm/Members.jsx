import React, {useEffect, useState} from 'react';
import "../communities.css";
import db from '../../games/firebaseStorage';
import { getUserId } from '../../../Context/AuthContext';
import Alert from "react-bootstrap/Alert";

const Members = (props) => {
    const [members, setMembers] = useState([]);
    
    useEffect(() => {
            db.collection("Community").doc(props.cid).get().then((snapshot)=>{
                if(snapshot){
                    var temp = snapshot.data();
                    temp = temp.Members;
                    temp.forEach((member)=>{
                        db.collection("Users").doc(member).get().then((value) => {
                            setMembers((prev)=>{
                                return[...prev,value.data()];
                            })
                        })
                    })
                }
            })
    }, [])

    return(
        <>
            <div>
                {
                    members&&(members.map((member)=>(
                        <>
                            <option key="member.Name">Member Name: {member.Name}</option>
                            <br />
                        </>
                        )
                    ))
                }
            </div>
        </>
    )
}

export default Members;
