import { DocumentSnapshot } from "@firebase/firestore";
import SelectInput from "@mui/material/Select/SelectInput";
import React, { useState } from "react";
import { RiFunctions } from "react-icons/ri";
import { getUserId } from "../../Context/AuthContext";
import db from "../games/firebaseStorage";

function FetchMyComm(){
    var fields;
    const [arr, setArr] = useState([]);
    const [res, setRes] = useState([]);

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
            temp = temp.Name;
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

    return(
        <div>
            <button onClick={fetchAll}>Search</button>
            <div>
                {
                    res.map((option)=>(
                        <option value={option}>{option}</option>
                    ))
                }
            </div>
        </div>
    )
}

export default FetchMyComm;