import React from "react";
import { Sidebar } from "./sidebar/sidebar";
import Grid from "@mui/material/Grid";
import { Route, Router, Routes, useNavigate,Navigate  } from "react-router-dom";
import Home from "./home/home";
import Message from "./message/message";
import Connection from "./connection/connection";
import Setting from "./setting/setting";
import Profile from "./profile/profile";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MailIcon from "@mui/icons-material/Mail";
import ArchiveIcon from "@mui/icons-material/Archive";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@chakra-ui/react";
import Post from "./sidebar/post";
const Root = () => {
  // const ismobile = usemediaquery({ query: `(max-width: 760px)` });
  const navigateTo = useNavigate();
  const [isLargerThan800] = useMediaQuery("(min-width: 760px)");
  const usernameSelector = useSelector((state) => state.user.user);
  const [valueBottomNav, setValueBottomNav] = React.useState(0);
  const [openPost, setOpenPost] = React.useState(false);
  const ref = React.useRef(null);
  const handleOpenPostModalOpen = () => {
    setOpenPost(true);
  };
  const handleOpenPostModalClose = () => {
    setOpenPost(false);
  };
  return (
    <div className="grid-container">
      <Grid container>
        {isLargerThan800 ? (
          <Grid item xs={3} lg={3}>
            <Sidebar />
          </Grid>
        ) : null}

        <Grid item xs={12} lg={6}>
          <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" exact  element={<Home />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/connections" element={<Connection />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/:profileName" element={<Profile />} />
          </Routes>
          {isLargerThan800 ? null : (
            <React.Fragment>
            <IconButton
            style={{ position: "absolute", bottom: 66, right: 10,backgroundColor:'#1DA1F2',color:'white',borderRadius:'100%',height:'50px',width:'50px',fontSize:'40px' }}
            onClick={handleOpenPostModalOpen}
          >
            +
          </IconButton>
          {openPost ? (
        <Post open={openPost} handleOpenPostModalClose={handleOpenPostModalClose} />
      ) : null}
            <Box ref={ref}>
              <Paper
                sx={{ position: "fixed", bottom: 0, left: 0, right: 0}}
                elevation={3}
              >
                <BottomNavigation
                  showLabels
                  value={valueBottomNav}
                  onChange={(event, newValue) => {
                    setValueBottomNav(newValue);
                    if (newValue === 3) navigateTo(`/${usernameSelector.username}`);
                    else if (newValue === 1) navigateTo("/messages");
                    else if (newValue === 2) navigateTo("/connections");
                    else navigateTo(`/home`);
                  }}
                >
                  <BottomNavigationAction
                    icon={<HomeIcon sx={{ fontSize: 30 }} />}
                  />
                  <BottomNavigationAction
                    icon={<MailIcon sx={{ fontSize: 30 }} />}
                  />
                  <BottomNavigationAction
                    icon={<PeopleIcon sx={{ fontSize: 30 }} />}
                  />
                  <BottomNavigationAction
                    icon={<Avatar src={usernameSelector.profile || ""} />}
                  />
                </BottomNavigation>
              </Paper>
            </Box>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Root;
