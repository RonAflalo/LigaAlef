import React, { useState } from "react";
import db from "../firebaseStorage";

function Fetch(){
    const [allDocs, setAllDocs] = useState([]);
    const [singleDoc, setSingleDoc] = useState({});

    function fetchAll(e){
        e.preventDefault();
        db.collection("Games").get().then((snapshot)=>{
            if(snapshot.docs.length>0){
                snapshot.docs.forEach((doc)=>{
                    setAllDocs((prev)=>{
                        return[...prev,doc.data()];
                    });
                });
            }
        });
        console.log(allDocs);
    }

    function fetchSingle(e){
        e.preventDefault();
        db.collection("Games").doc("Game14").get().then((snapshot)=>{
            if(snapshot){
                setSingleDoc(snapshot.data());
            }
        });
        console.log(singleDoc);
    }

    return(
        <div>
            <h1>Fetching Data</h1>
            <button onClick={fetchAll}>Fetch All Docs</button>
            <button onClick={fetchSingle}>Fetch Single Doc</button>

            <h1>{singleDoc.Gid}</h1>
            <h1>{singleDoc.Location}</h1>
            <h1>{singleDoc.minP}</h1>
            <h1>{singleDoc.maxP}</h1>
            <h1>{singleDoc.Pitch}</h1>

            <div>
                {
                    allDocs.map((doc)=>{
                        return(
                            <div>
                                <h1>{doc.Gid}</h1>
                                <h1>{doc.Location}</h1>
                                <h1>{doc.minP}</h1>
                                <h1>{doc.maxP}</h1>
                                <h1>{doc.Pitch}</h1>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Fetch;