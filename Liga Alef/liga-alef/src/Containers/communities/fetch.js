import React, { useState } from "react";
import db from "../games/firebaseStorage";

function Fetch(){
    const [allDocs, setAllDocs] = useState([]);
    const [singleDoc, setSingleDoc] = useState({});
    const [Comm, setComm] = useState({name: "", id: "", type: ""});

    const handleChange = (event) =>{
        event.preventDefault();
        const {name, value} = event.target;
        setComm((prev) => {
          return {...prev, [name]: value};
        });
      };

    function fetchAll(e){
        e.preventDefault();
        db.collection("Community").get().then((snapshot)=>{
            if(snapshot.docs.length>0){
                snapshot.docs.forEach((doc)=>{
                    setAllDocs((prev)=>{
                        return[...prev,doc.data()];
                    });
                });
            }
        });
        //console.log(allDocs);
    }

    function fetchSingle(e){
        e.preventDefault();
        db.collection("Community").doc("???").get().then((snapshot)=>{
            if(snapshot){
                setSingleDoc(snapshot.data());
            }
        });
        console.log(singleDoc);
    }

    return(
        <div>
            <input type='text' name='name' value={Comm.name} onChange={handleChange} placeholder="Community Name" />
            <input type='text' name='id' value={Comm.id} onChange={handleChange} placeholder="Community ID" />
            <input type='text' name='type' value={Comm.type} onChange={handleChange} placeholder="Community Type" />
            <button onClick={fetchAll}>Search</button>
            <div>
                {
                    allDocs.map((doc)=>{
                        return(
                            <div>
                                <h4>Community Id: {doc.Community_ID}</h4>
                                <h4>Community Name: {doc.Name}</h4>
                                <h4>Type: {doc.Type}</h4>
                                <h4>Max Members: {doc.MaxMember}</h4>
                                
                                <br /><br />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Fetch;