// import React from "react";
import { auth } from "../../setup/firebase";
import { Sidebar } from "../sidebar/sidebar";
import * as React from 'react';
import { Feed } from "../feed/feed";
import { Rightbar } from "../rightbar/rightbar";
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// import "./home.css";
function Home() {
  // console.log(auth.currentUser);
  const [currentUser, setCurrentUser] = React.useState(auth.currentUser);
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="grid-container"> 
    <Grid container spacing={3}>
      <Grid item xs='auto'>
        <Sidebar defaultActive={0}/>
      </Grid>
      <Grid item xs={8} lg={6}>
        <Feed/>
        {/* <Outlet/> */}
      </Grid>
      <Grid item xs display={{ xs: "none", lg: "block" }}>
        <Rightbar />
      </Grid>
    </Grid>
    </div>
  );
}

export default Home;
