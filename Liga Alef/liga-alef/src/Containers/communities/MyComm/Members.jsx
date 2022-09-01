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
            <table><tr>
                {
                    members&&(members.map((member)=>(
                        <><td>
                            Community Member
                        </td>
                        </>
                        )
                    ))
                }
            </tr>
                <tr>
                {
                    members&&(members.map((member)=>(
                        <><td>
                            <option key="member.Name">{member.Name}</option>
                            <br />
                            </td>
                        </>
                        )
                    ))
                }
            </tr></table>
            </div>
        </>
    )
}

export default Members;
