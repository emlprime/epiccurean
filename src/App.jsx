import React, { useState, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { collection, doc, getDocs, setDoc, getFirestore } from "firebase/firestore";
import "./style.css";
import Fight from "./Fight";
import { getCurrentUser } from "./CurrentUser";

// Configure Firebase.
//TODO remove api key from github
const config = {
  apiKey: "AIzaSyBtTdVWE1AZ1JRENUUiAlzqlIXsaTVhCkc",
  authDomain: "nidaviller-fe.firebaseapp.com",
  projectId: "nidaviller-fe",
};
const app = firebase.initializeApp(config);
const db = getFirestore(app);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);
  const currentUser = getCurrentUser(firebase);
  if (!isSignedIn) {
    return (
      <div>
        <h1>Epicurean Brawl</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>Epicurean Brawl</h1>
      <p>Welcome {currentUser.displayName}! Get ready to RUMBLE!</p>
      <button type="button" onClick={() => firebase.auth().signOut()}>
        Sign-out
      </button>
      <Style>
        <Fight db={db} />
      </Style>
    </div>
  );
}

export default App;

const Style = styled.div`
  .left {
    color: blue;
  }
  .right {
    color: red;
  }
`;
