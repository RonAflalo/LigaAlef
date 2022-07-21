import React, { useState } from "react";
import db from "../../games/firebaseStorage";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { getUserId } from "../../../Context/AuthContext";
import firebase from "firebase/compat/app";

function Fetch() {
  const [show, setShow] = useState(false);
  const [allDocs, setAllDocs] = useState([]);
  const [Comm, setComm] = useState({ name: "", id: "", type: "Soccer" });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setComm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSelect = (key) => (event) => {
    event.preventDefault();
    setComm((prev) => {
      return { ...prev, [key]: event.target.value };
    });
  };

  const fetchFiltered = (e) => {
    e.preventDefault();
    setAllDocs([]);

    console.log(Comm.name);
    console.log(Comm.type);

    var query = db.collection("Community");
    if(Comm.name)
      query = query.where('Name', '==', Comm.name);
    if(Comm.id)
      query = query.where('Community_ID', '==', Comm.id);
      query = query.where('Type', '==', Comm.type);
    query.get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        snapshot.docs.forEach((doc) => {
          setAllDocs((prev) => {
            return [...prev, doc.data()];
          });
        });
      }
    });
      setComm({name: '', id: '', type: 'Soccer'});
  };  

  const fetchAll = (e) => {
    e.preventDefault();
    setAllDocs([]);

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

  const clearList = (e) =>{
    e.preventDefault();
    setAllDocs([]);
    setComm([]);
  }

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
      <select value={Comm.type} onChange={handleSelect("type")}>
        <option value={"Soccer"}>Soccer</option>
        <option value={"Basketball"}>BasketBall</option>
        <option value={"Volyball"}>VolyBall</option>
      </select>
      <br />
      <button onClick={fetchFiltered}>Serach</button>
      <button onClick={fetchAll}>Show All</button>
      <button onClick={clearList}>Clear</button>
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
