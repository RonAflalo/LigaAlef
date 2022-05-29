import React, { useState } from "react";
import db from "../../games/firebaseStorage";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { getUserId } from "../../../Context/AuthContext";
import firebase from "firebase/compat/app";

function Fetch() {
  const [show, setShow] = useState(false);
  const [allDocs, setAllDocs] = useState([]);
  const [Comm, setComm] = useState({ name: "", id: "", type: "" });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setComm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const fetchAll = (e) => {
    e.preventDefault();
    db.collection("Community")
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          snapshot.docs.forEach((doc) => {
            setAllDocs((prev) => {
              return [...prev, doc.data()];
            });
          });
        }
      });
  };

  const showChat = () => {};

  const joinCommunity = (commId) => (event) => {
    event.preventDefault();
    var ref = db.collection("Community").doc(commId);
    ref.update({
      Members: firebase.firestore.FieldValue.arrayUnion(getUserId()),
    });
    var creator = db.collection("Users").doc(getUserId());
    creator.update({
      Communities: firebase.firestore.FieldValue.arrayUnion(ref.id),
    });
    setShow(true);
    setAllDocs([]);
  };

  return (
    <div>
      <Alert show={show} variant="success">
        <Alert.Heading>You Join Community Successfully</Alert.Heading>
        <p>Enjoy</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Ok!
          </Button>
        </div>
      </Alert>
      <input
        type="text"
        name="name"
        value={Comm.name}
        onChange={handleChange}
        placeholder="Community Name"
      />
      <input
        type="text"
        name="id"
        value={Comm.id}
        onChange={handleChange}
        placeholder="Community ID"
      />
      <input
        type="text"
        name="type"
        value={Comm.type}
        onChange={handleChange}
        placeholder="Community Type"
      />
      <button onClick={fetchAll}>Serach</button>
      <div>
        {allDocs.map((doc) => {
          return (
            <>
              <option>Community Name: {doc.Name}</option>
              <option>Admin Name: {doc.Admin.Name}</option>
              <option>Type: {doc.Type}</option>
              <option>
                Members: {doc.Members.length}/{doc.MaxMember}
              </option>
              <button onClick={joinCommunity(doc.Community_ID)}>Join</button>

              <br />
              <br />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Fetch;
