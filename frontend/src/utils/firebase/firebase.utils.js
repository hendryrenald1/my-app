import { initializeApp } from "firebase/app";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, createUserWithEmailAndPassword , signInWithEmailAndPassword, signOut } from "firebase/auth";



const firebaseConfig = require("./firebase-config.json"); 

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const auth = getAuth()   // auth object;
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) {
    console.error('Email and password are required');
    return null;
  }

  return await createUserWithEmailAndPassword(auth, email, password);
   
  
}


export const signInUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) {
    console.error('Email and password are required');
    return null;
  }

  return await signInWithEmailAndPassword(auth, email, password);
   
  
}


export const signOutUser = async () => {
  return await signOut(auth);
}

export const createNeo4jUser = async (userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) {
    console.error("Invalid userAuth object");
    return;
  }

  try {
    const { displayName = '', email = '' } = userAuth ?? {};
    const response = await axios.post("http://localhost:4000/register", {
      displayName,
      email,
      ...additionalInformation,
    });
    console.log("User created:", response.data);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}