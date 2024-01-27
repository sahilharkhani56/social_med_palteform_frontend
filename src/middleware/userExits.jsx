import React from "react";
import { Navigate, useParams } from "react-router-dom";
import firebase, { auth, db } from "../setup/firebase.js";
import "firebase/compat/firestore";
export const UserExits =({ children }) =>{
  const { profileName } = useParams();
  let flag=0;
  try {
    const docRefUser = firebase.firestore().collection("users");
    const snapshot = docRefUser
      .where("username", "==", profileName)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            flag=1;
            console.log(doc.data(),flag);
        });
        // navigateTo("/", { replace: true });
      });
  } catch (error) {
      console.error("Error fetching user details:", error);
      return <Navigate to={"/"} replace={true}></Navigate>;
  }
  
  console.log(flag);
  if(flag===0)return <Navigate to={"/"} replace={true}></Navigate>;
  return children;
};
