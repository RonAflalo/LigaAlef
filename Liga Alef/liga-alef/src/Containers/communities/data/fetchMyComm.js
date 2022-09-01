import React, { useState, useEffect } from "react";
import { getUserId } from "../../../Context/AuthContext";
import db from "../../games/firebaseStorage";
import { Link } from "react-router-dom";

function FetchMyComm() {
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

  return (
    <div>
      <div>
        {res.map((comm) => (
              <>
              <button value={comm.Name} onClick={''}>
                <Link
                to="/my-comm"
                state={{ name: comm.Name, id: comm.Community_ID }}>
                {comm.Name}
                </Link>
                </button>
              </>
            ))}
      </div>
    </div>
  );
}

export default FetchMyComm;
