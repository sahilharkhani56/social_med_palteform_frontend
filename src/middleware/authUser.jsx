import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../setup/firebase";
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
