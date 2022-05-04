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
            <button onClick={fetchAll}>Show All Community Games</button>

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
                                <h3>Game Id: {doc.Gid}</h3>
                                <h3>Game Location: {doc.Location}</h3>
                                <h3>Min Players: {doc.minP}</h3>
                                <h3>Max Players: {doc.maxP}</h3>
                                <h3>Teams: {doc.Teams}</h3>
                                <h3>Pitch: {doc.Pitch}</h3>
                                <h3>Date: {doc.Date.Day}.{doc.Date.Month}.{doc.Date.Year}</h3>
                                <h3>Time: {doc.Time}</h3>
                                <br />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Fetch;