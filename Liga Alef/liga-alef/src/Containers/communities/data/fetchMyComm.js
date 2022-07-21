import React, { useState, useEffect } from "react";
import { getUserId } from "../../../Context/AuthContext";
import db from "../../games/firebaseStorage";
import { Link } from "react-router-dom";
function FetchMyComm() {
  const [arr, setArr] = useState([]);
  const [res, setRes] = useState([]);

  useEffect(() => {
    db.collection("Users")
    .doc(getUserId())
    .get()
    .then((value) => {
      var fields = value.data();
      fields = fields.Communities;
      for (const i in fields) {
        addToRes(fields[i]);
      }
    });
  }, [])

  function addToRes(item) {
    db.collection("Community")
      .doc(item)
      .get()
      .then((value) => {
        var temp = value.data();
        setRes((res) => [...res, temp]);
      });
  }

  function fetchAll(e) {
    e.preventDefault();
    //GetCommunities();
    setRes([]);
    for (const i in arr) {
      addToRes(arr[i]);
    }
  }

  return (
    <div>
      <div>
        {res.map((option) => (
          <>
            <option value={option.Name}>{option.Name}</option>
            <Link
              to="/my-comm"
              state={{ name: option.Name, id: option.Community_ID }}>
              Community Page
            </Link>
            <br /><br />
          </>
        ))}
      </div>
    </div>
  );
}

export default FetchMyComm;
