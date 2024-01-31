import React from "react";
import { Navigate, useParams } from "react-router-dom";
import firebase, { auth, db } from "../setup/firebase.js";
import "firebase/compat/firestore";
export const AuthUser = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  setInterval(() => {
    if (!currentUser) {
      return <Navigate to={"/"} replace={true}></Navigate>;
    }
  }, 1000);
  return children;
};

export const UserExits = ({children }) => {
  const { profileName } = useParams();
  const [userExists, setUserExists] = React.useState(true);
  React.useEffect(() => {
    const checkUser = async() => {
      try {
        const doesUserExist = await checkUserExists(profileName);
        setUserExists(doesUserExist);
      } catch (error) {
        console.error('Error checking user existence:', error);
        setUserExists(false);
      }
    };
    checkUser();
  }, [profileName]);

  if (!userExists) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }
  return children
};
const checkUserExists = async(profileName) => {
  try {
    const docRefUser = firebase.firestore().collection('users');
    const snapshot = await docRefUser.where('username', '==', profileName).get();

    if (snapshot.size > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
