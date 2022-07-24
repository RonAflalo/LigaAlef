import React from 'react';
import "../communities.css";
import db from '../../games/firebaseStorage';
import { Link } from 'react-router-dom';
import { getUserId } from '../../../Context/AuthContext';
import firebase from "firebase/compat/app";


const CommInfo = (props) => {
    function leaveComm(){
        var ref = db.collection("Community").doc(props.cid);
        ref.update({
          Members: firebase.firestore.FieldValue.arrayRemove(getUserId()),
        });
        var Leaver = db.collection("Users").doc(getUserId());
        Leaver.update({
          Communities: firebase.firestore.FieldValue.arrayRemove(props.cid),
        });
    }

    return(
        <>
        <h1>Info + Rules</h1>
        <Link
              to="/communities"
              onClick={leaveComm()}>
              Leave Community
            </Link>
        </>
    )
}

export default CommInfo;
