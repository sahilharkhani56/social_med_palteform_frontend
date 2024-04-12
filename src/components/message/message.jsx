import { Grid, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { AppBar, Box, TextField } from "@mui/material";
import firebase, { auth, db } from "../../setup/firebase.js";
import IconButton from "@mui/material/IconButton";
import "firebase/compat/firestore";
import "./allContect.css";
import { useSelector } from "react-redux";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  and,
  or,
  updateDoc,
} from "firebase/firestore";
const Message = () => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [filterUser, setFilterUser] = React.useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const navigateTo = useNavigate();

  const handleClick = () => {
    navigateTo("/allcontect");
  };
  const getAllInterectedUser = () => {
    const currentUserUid = usernameSelector?.uid;

    const messagesCollectionRef = collection(db, "messages");
    const q = query(
      messagesCollectionRef,
      or(
        where("to", "==", usernameSelector?.uid),
        where("from", "==", usernameSelector?.uid)
      )
    );
    const lastMessagesMap = new Map();
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const promises = [];
      querySnapshot.forEach((doc) => {
        const { from, to, text, createdAt } = doc.data();
        const otherUserUid = from === currentUserUid ? to : from;
        if (
          !lastMessagesMap.has(otherUserUid) ||
          createdAt > lastMessagesMap.get(otherUserUid).createdAt
        ) {
          lastMessagesMap.set(otherUserUid, { from, to, text, createdAt });
          promises.push(
            firebase
              .firestore()
              .collection("users")
              .doc(otherUserUid)
              .get()
              .then((snapshot) => {
                const { username, profile } = snapshot.data();
                lastMessagesMap.set(otherUserUid, {
                  ...lastMessagesMap.get(otherUserUid),
                  username,
                  profile,
                });
              })
          );
        }
      });
      await Promise.all(promises);
      const lastMessagesArray = Array.from(lastMessagesMap.values());
      lastMessagesArray.sort((a, b) => b.createdAt - a.createdAt);
      setAllFriends(lastMessagesArray);
      setFilterUser(lastMessagesArray);
    });
  };
  const handleOpenProfileChat = (data, index) => {
    navigateTo(`/messages/${data.username}`);
  };
  const handleChangeSearchField = (event) => {
    const query = event.target.value;
    var updatedList = [...allFriends];
    updatedList = updatedList.filter((item) => {
      return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    setFilterUser(updatedList);
  };
  useEffect(() => {
    getAllInterectedUser();
  }, [usernameSelector]);
  return (
    <div className="grid-container">
      <Grid container>
        <Grid
          item
          xs={12}
          style={{ overflow: "auto", height: "100vh" }}
          className="msgPortion"
        >
          {/* url(https://www.gstatic.com/dynamite/images/cr/empty_invited_members.svg) */}
          {/* <center
                  style={{
                    display:'flex',
                    height: "100%",
                    flexDirection: "column",
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >
                  <img
                    src={`https://www.gstatic.com/dynamite/images/cr/empty_invited_members.svg`}
                    height={'300px'}
                    alt=""
                    loading="lazy"
                  />
                  <div>
                    <Typography variant="h7">UNDER CONSTRUCTION</Typography>
                  </div>
                </center> */}

          <AppBar
            component="nav"
            position="sticky"
            className="searchBarMsg"
            elevation={0}
          >
            <Toolbar variant="dense">
              {/* <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => navigateTo('/messages')}
              >
                <ArrowBack />
              </IconButton> */}
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                className="appBarUsername"
              >
                Messages
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={1}>
                <Chip
                  label="All Users"
                  variant="outlined"
                  onClick={handleClick}
                />
              </Stack>
              {/* <IconButton
                    color="inherit"
                    aria-label="more options"
                    // onClick={openLogout}
                  >
                    <MoreVert />
                  </IconButton> */}
            </Toolbar>
          </AppBar>
          <Box className="searchFriendMsg">
            <TextField
              id="filled-search"
              label="Search or start new chat"
              type="search"
              variant="filled"
              className="searchField"
              autoComplete="off"
              onChange={handleChangeSearchField}
            />
          </Box>
         
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {filterUser?.map((data, index) => {
                return (
                  <Box
                    key={index}
                    onClick={() => handleOpenProfileChat(data, index)}
                  >
                    <ListItem
                      alignItems="flex-start"
                      key={index}
                      className="userList"
                    >
                      <ListItemAvatar sx={{ marginTop: 0 }}>
                        <Avatar alt="" src={data.profile} />
                      </ListItemAvatar>
                      <Box sx={{ height: "40px", alignItems: "center" }}>
                        <Typography
                          variant="h7"
                          fontWeight={600}
                          component="div"
                          color="text.primary"
                        >
                          {data.username}
                        </Typography>
                        <Typography
                          variant="body2"
                          noWrap
                          component="div"
                          color="text.primary"
                        >
                          {data.text}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </Box>
                );
              })}
            </List>
          {/* ) : (
            <center
              style={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`https://www.gstatic.com/dynamite/images/cr/empty_invited_members.svg`}
                height={"300px"}
                alt=""
                loading="lazy"
              />
              <div>
                <Typography variant="h7">UNDER CONSTRUCTION</Typography>
              </div>
            </center>
          )} */}
        </Grid>
      </Grid>
    </div>
  );
};

export default Message;
