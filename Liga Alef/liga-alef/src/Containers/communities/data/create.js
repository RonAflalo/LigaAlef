import React, { useState } from "react";
import db from "../../games/firebaseStorage";
import { useNavigate } from "react-router-dom";
import { getUserId, getUserName } from "../../../Context/AuthContext";
import firebase from "firebase/compat/app";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "../communities.css";
function Create() {
  const [errorMessage, setErrorMessage] = useState();
  const [comm, setComm] = useState({ name: "", type: "", maxmember: "" });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setComm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const addDocument = (event) => {
    event.preventDefault();

    setErrorMessage("");
    validateData();
    if (errorMessage === "") {
      var ref = db.collection("Community").doc();
      ref
        .set({
          Community_ID: ref.id,
          Name: comm.name,
          Type: comm.type,
          MaxMember: comm.maxmember,
          Members: [],
          ActiveGames: [],
          Admin: { Id: getUserId(), Name: getUserName() },
        })
        .then(() => {
          ref.update({
            Members: firebase.firestore.FieldValue.arrayUnion(getUserId()),
          });
          var creator = db.collection("Users").doc(getUserId());
          creator.update({
            Communities: firebase.firestore.FieldValue.arrayUnion(ref.id),
          });

          var data = {
            message: "You are now the admin of " + comm.name + ".",
            time: Date.now(),
          };
          db.collection("Users")
            .doc(getUserId())
            .collection("Notifications")
            .add({ data });

          setShow(true);
          setComm({ name: "", type: "", maxmember: "" });
        })
        .catch((err) => {
          console.log("Error " + err.message);
        });
    }
  };

  function validateData() {
    if (comm.name.length < 3) {
      setErrorMessage("Community Name Is Too Short");
    } else if (
      comm.type != "Soccer" &&
      comm.type != "Basketball" &&
      comm.type != "Volyball"
    ) {
      setErrorMessage("Community Type Is Invalide");
    } else if (comm.maxmember < 1) {
      setErrorMessage("Something Wrong With Member Limitation");
    } else {
      setErrorMessage("");
    }
  }

  return (
    <>
      <div>
        <Alert show={show} variant="success">
          <Alert.Heading>Community Has Successfully Created!</Alert.Heading>
          <p>It's Time To Check-In And Play!</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShow(false)} variant="outline-success">
              Ok!
            </Button>
          </div>
        </Alert>
        {<label>{errorMessage}</label>}
        <form onSubmit={addDocument}>
          <label className="namelabel">Community Name</label>
          <input
            className="commName"
            type="text"
            name="name"
            value={comm.name}
            onChange={handleChange}
            placeholder="Community Name"
          />
          <br />
          <label>Community Type</label>
          <input
            className="commType"
            type="text"
            name="type"
            value={comm.type}
            onChange={handleChange}
            placeholder="Type"
          />
          <br />
          <label>Max members</label>
          <input
            className="commMax"
            type="number"
            name="maxmember"
            value={comm.maxmember}
            onChange={handleChange}
            placeholder="Max Member"
          />
          <br />
          <br />
          <button>Create!</button>
        </form>
      </div>
    </>
  );
}

export default Create;
