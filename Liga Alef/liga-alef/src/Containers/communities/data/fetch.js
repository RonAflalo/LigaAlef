import React, { useState } from "react";
import db from "../../games/firebaseStorage";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { getUserId } from "../../../Context/AuthContext";
import firebase from "firebase/compat/app";

function Fetch() {
  const [show, setShow] = useState(false);
  const [leaveComm, setLeave] = useState(false);
  const [allDocs, setAllDocs] = useState([]);
  const [Comm, setComm] = useState({ name: "", id: "", type: "Soccer" });
  var notification;
  var comName;

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

    var query = db.collection("Community");
    if (Comm.name) query = query.where("Name", "==", Comm.name);
    if (Comm.id) query = query.where("Community_ID", "==", Comm.id);
    query = query.where("Type", "==", Comm.type);
    query.get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        snapshot.docs.forEach((doc) => {
          setAllDocs((prev) => {
            return [...prev, doc.data()];
          });
        });
      }
    });
    setComm({ name: "", id: "", type: "Soccer" });
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

  const clearList = (e) => {
    e.preventDefault();
    setAllDocs([]);
    setComm([]);
  };

  const manageCommunity = (commId) => (event) => {
    event.preventDefault();
    var msg;
    var ref = db.collection("Community").doc(commId);
    ref.get().then((snapshot) => {
      var membersList = snapshot.data();
      membersList = membersList.Members;
      if (membersList.find((member) => member === getUserId())) {
        setLeave(true);
        ref.update({
          Members: firebase.firestore.FieldValue.arrayRemove(getUserId()),
        });
        var Leaver = db.collection("Users").doc(getUserId());
        Leaver.update({
          Communities: firebase.firestore.FieldValue.arrayRemove(ref.id),
        });
        msg = "You have left ";
      } else {
        ref.update({
          Members: firebase.firestore.FieldValue.arrayUnion(getUserId()),
        });
        var creator = db.collection("Users").doc(getUserId());
        creator.update({
          Communities: firebase.firestore.FieldValue.arrayUnion(ref.id),
        });
        setShow(true);
        setAllDocs([]);
        msg = "You have joined ";
      }

      comName = db
        .collection("Community")
        .doc(commId)
        .get("Name")
        .then((comName) => {
          comName = comName.data();
          console.log(comName.Name);
          msg = msg + comName.Name;
          console.log(comName);
          console.log(msg);

          const data = {
            message: msg,
            time: Date.now(),
          };
          db.collection("Users")
            .doc(getUserId())
            .collection("Notifications")
            .add({ data });
        });
    });
  };

  function afterJoin() {
    setShow(false);
    window.location.reload();
  }

  function afterLeave() {
    setLeave(false);
    window.location.reload();
  }

  return (
    <div>
      <Alert show={show} variant="success">
        <Alert.Heading>You Join Community Successfully</Alert.Heading>
        <p>Enjoy</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => afterJoin()} variant="outline-success">
            Ok!
          </Button>
        </div>
      </Alert>
      <Alert show={leaveComm} variant="dark">
        <Alert.Heading>We Are Sorry To See You Leaving</Alert.Heading>
        <p>Hope We Get Together Vary Soon</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => afterLeave()} variant="outline-success">
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
      <br />
      <input
        type="text"
        name="id"
        value={Comm.id}
        onChange={handleChange}
        placeholder="Community ID"
      />
      <br />
      <select value={Comm.type} onChange={handleSelect("type")}>
        <option value={"Soccer"}>Soccer</option>
        <option value={"Basketball"}>BasketBall</option>
        <option value={"Volyball"}>VolyBall</option>
      </select>
      <br />
      <br />
      <button onClick={fetchFiltered}>Serach</button>
      <button className="showall" onClick={fetchAll}>
        Show All
      </button>
      <button className="clear" onClick={clearList}>
        Clear
      </button>
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
              <button
                onClick={manageCommunity(doc.Community_ID)}
                disabled={doc.Members.length >= doc.MaxMember}>
                {doc.Members.find((obj) => obj === getUserId())
                  ? "Leave"
                  : "Join"}
              </button>

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
