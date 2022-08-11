import React, { useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { getUserId, getUserName, useAuth } from "../../Context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import db from "../games/firebaseStorage";
import ListGroup from 'react-bootstrap/ListGroup';

export default function Dashboard() {
  const [numOfNotes, setNumOfNotes] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [content, setContent] = useState([]);
  const [error, setError] = useState("")
  const [notification, setNotification] = useState([]);
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  async function handleLogout() {
    setError("")

    try {
      await logout();
      navigate("/");
      window.location.reload();
    } catch {
      setError("Failed to log out")
    }
  }

  // notifications

  async function getAllNotifications() {
    const notificationsRef = db.collection("Users").doc(getUserId()).collection('Notifications');
    const snapshot = await notificationsRef.get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  
    
    setContent([])
    snapshot.forEach(doc => {
      var temp = doc.data();
      temp = temp.data;
      console.log(temp);
     //console.log(doc.id, '=>', doc.data());
      setContent((prev) => {
        return [...prev, temp];
      });
       // console.log(content);
    });
    return content;
  }
  


  useEffect(() => {
    const getNotification = async () => {
        try {
            const getNotification = await getAllNotifications();
            setNotification(getNotification);
        } catch(error) {
           
        }
    };
    getNotification(); 
}, []);

if (!notification){
    console.log("wait"); 
}else{
    console.log(notification);
}

function showNotesList(){

}

  //
  return (
    <>
      <Card className="w-25">
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>User Name:</strong> {getUserName()}
          <br />
          <strong>Email:</strong> {currentUser.email}
          <br /><br />
          {(notification.length > 0 ? "Hey! You Have " + notification.length + " New Notification's" : 'There Is No Any Notification For You!')}
          <Button variant="primary" className="w-100 mt-3" 
                onClick={() => (showNotes ? setShowNotes(false) : setShowNotes(true))} 
                      disabled={!(notification.length>0)}>{showNotes ? 'Close' : 'Show Me'}</Button>
          <br /><br /><br />
          {showNotes&&content.map((note) => (
          <option>Note: {note.message}</option>
          ))}

          <Link to="/update-profile" className="btn btn-secondary w-100 mt-3">
            Update Profile
          </Link>
          <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
          Log Out
        </Button>
        </Card.Body>

      </Card>
    </>
  )
}


//need to display messages screen