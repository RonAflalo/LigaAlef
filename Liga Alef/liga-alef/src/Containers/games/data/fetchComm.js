import React, { useState } from "react";
import { getUserId } from "../../../Context/AuthContext";
import db from "../firebaseStorage";

function FetchCommunity(){
    const [allDocs, setAllDocs] = useState([]);
    const [Comm, setComm] = useState("");
    const [Comm2, setComm2] = useState([]);
    const [info, setInfo] = useState({name:""});

    const handleChange = (event) =>{
        event.preventDefault();
        const {name, value} = event.target;
        setComm((prev) => {
          return {...prev, [name]: value};
        });
        console.log(Comm);
      };

      const handleSelect = (key) => (event) => {
          event.preventDefault();
        setInfo({ [key]: event.target.value });
        console.log(info);
      };

    function fetchAll(e){
        e.preventDefault();

        db.collection("Users").doc(getUserId()).get().then((snapshot)=>{
            if(snapshot){
                setComm2(snapshot.data().Communities);
            }
        });
    }


    return(
        <div>
            <button onClick={fetchAll}>Search</button>
            <div>
                <select value={info.name} onChange={handleSelect("name")}>
                <option value="">Choose Community</option>
                {Comm2.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
            </div>
        </div>
    )
}

export default FetchCommunity;