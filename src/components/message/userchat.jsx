import { Grid, Toolbar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack, DataObject } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { useMediaQuery } from "@chakra-ui/react";
import toast from "react-hot-toast";
import {
  collection,
  query,
  where,
  onSnapshot,
  and,
  or,
  updateDoc,
} from "firebase/firestore";
const UserChat = () => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [isLargerThan800] = useMediaQuery("(min-width: 760px)");
  const navigateTo = useNavigate();
  const { profileName } = useParams();
  const [receiverDataInfo, setReceiverDataInfo] = useState();
  const [currentChatMessage, setCurrentChatMessage] = useState("");
  const [allMutualMessages, setAllMutualMessages] = useState([]);
//   const messagesEndRef = (useRef < null) | (HTMLDivElement > null);
  const receiverData = async () => {
    const docRef = firebase.firestore().collection("users");
    const snapshot = await docRef.where("username", "==", profileName).get();
    let userData;
    snapshot.forEach((doc) => {
      userData = doc.data();
      const uid = "uid";
      userData[uid] = doc.id;
    });
    setReceiverDataInfo(userData);
  };
  const currentInputMessage = async () => {
    setCurrentChatMessage("");
    const docRef = firebase.firestore().collection("messages");
    try {
      await docRef.add({
        from: usernameSelector?.uid,
        to: receiverDataInfo?.uid,
        text: currentChatMessage,
        createdAt: new Date(),
      });
      
// });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchMessages = () => {
    // const docRef = firebase.firestore().collection("messages");
    const docCollectionRef = collection(db, "messages");
    if (usernameSelector?.uid && receiverDataInfo?.uid) {
      const q = query(
        docCollectionRef,
        or(
          and(
            where("to", "==", usernameSelector?.uid),
            where("from", "==", receiverDataInfo?.uid)
          ),
          and(
            where("from", "==", usernameSelector?.uid),
            where("to", "==", receiverDataInfo?.uid)
          )
        )
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tempAllMutualChats = [];
    querySnapshot.forEach((doc) => {
        const { text, from, to, createdAt } = doc.data();
        const milliseconds = createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6;
        const dateObject = new Date(milliseconds);
        tempAllMutualChats.push({ text, from, to, createdAt: dateObject });
    });
    tempAllMutualChats.sort((a, b) => a.createdAt - b.createdAt);
    setAllMutualMessages(tempAllMutualChats);
});
      
    }
  };
  const handleClick = () => {
    navigateTo(`/${profileName}`);
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    receiverData();
  }, [profileName]);

  useEffect(() => {
    // scrollToBottom();
    fetchMessages();
  }, [receiverDataInfo]);

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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1 }}
                onClick={() => navigateTo("/messages")}
              >
                <ArrowBack />
              </IconButton>
              <Avatar src={receiverDataInfo?.profile} sx={{ mr: 1 }} />
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                className="appBarUsername"
              >
                {receiverDataInfo?.username}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
          </AppBar>
          <Box sx={{ pt: 3 }} width={"100%"}>
            <Avatar
              src={receiverDataInfo?.profile}
              sx={{ mr: 1, width: "100px", height: "100px", margin: "auto" }}
            />
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              className="appBarUsername"
              sx={{ margin: "auto", textAlign: "center" }}
            >
              {receiverDataInfo?.username}
            </Typography>
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ margin: "auto", textAlign: "center", fontSize: "15px" }}
            >
              {receiverDataInfo?.bio}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ textAlign: "center", width: 64, margin: "auto" }}
            >
              <Chip label="Profile" variant="outlined" onClick={handleClick} />
            </Stack>
            <Divider sx={{ mt: 2, mb: 2 }} />
          </Box>

          <div>
            {isLargerThan800 ? (
              <>
                <Box sx={{ mb: 8 }}>
                {allMutualMessages?.map((data, index) => {
                    {/* fffefwefewfewfwefefefewfefefew */}
                    return (
                      <Box key={index} className="outerMsgBox">
                        {data.from === usernameSelector.uid ? (
                          <Box className="fromMsg">
                            <Typography variant="h6" component="h2" noWrap className="msgTextField" >
                              {data.text}
                            </Typography>
                          </Box>
                        ) : (
                            <Box className="toMsg">
                            <Typography variant="h6" component="h2" noWrap className="msgTextFieldReceiver" >
                              {data.text}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                  {/* <div ref={messagesEndRef} /> */}
                </Box>
                <Box
                  sx={{ display: "flex" }}
                  position={"fixed"}
                  bottom={0}
                  width="50%"
                  bgcolor="white"
                  maxWidth="md"
                  mx="auto"
                >
                  <TextField
                    placeholder="Type a message"
                    className="inputText"
                    autoComplete="off"
                    sx={{ outline: 0, "& fieldset": { border: "none" }, p: 0 }}
                    inputProps={{ style: { fontSize: 16 } }}
                    InputLabelProps={{ style: { fontSize: 16 } }}
                    onChange={(e) => setCurrentChatMessage(e.target.value)}
                    value={currentChatMessage}
                  ></TextField>
                  {currentChatMessage.length > 0 ? (
                    <IconButton
                      className="sendBtn"
                      onClick={currentInputMessage}
                    >
                      <SendIcon sx={{ fontSize: 34 }}></SendIcon>
                    </IconButton>
                  ) : (
                    <IconButton className="sendBtn" disabled>
                      <SendIcon sx={{ fontSize: 34 }}></SendIcon>
                    </IconButton>
                  )}
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ mb: 14 }}>
                {allMutualMessages?.map((data, index) => {
                    {/* fffefwefewfewfwefefefewfefefew */}
                    return (
                      <Box key={index} className="outerMsgBox">
                        {data.from === usernameSelector.uid ? (
                          <Box className="fromMsg">
                            <Typography variant="h6" component="h2" noWrap className="msgTextField" >
                              {data.text}
                            </Typography>
                          </Box>
                        ) : (
                            <Box className="toMsg">
                            <Typography variant="h6" component="h2" noWrap className="msgTextFieldReceiver" >
                              {data.text}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                  {/* <div ref={messagesEndRef} /> */}
                </Box>
                <Box
                  sx={{ display: "flex" }}
                  position={"fixed"}
                  bottom={56}
                  width="100%"
                  bgcolor="white"
                  maxWidth="md"
                  mx="auto"
                >
                  <TextField
                    placeholder="Type a message"
                    className="inputText"
                    autoComplete="off"
                    sx={{ outline: 0, "& fieldset": { border: "none" }, p: 0 }}
                    inputProps={{ style: { fontSize: 16 } }}
                    InputLabelProps={{ style: { fontSize: 16 } }}
                    onChange={(e) => setCurrentChatMessage(e.target.value)}
                    value={currentChatMessage}
                  ></TextField>
                  {currentChatMessage.length > 0 ? (
                    <IconButton
                      className="sendBtn"
                      onClick={currentInputMessage}
                    >
                      <SendIcon sx={{ fontSize: 34 }}></SendIcon>
                    </IconButton>
                  ) : (
                    <IconButton className="sendBtn" disabled>
                      <SendIcon sx={{ fontSize: 34 }}></SendIcon>
                    </IconButton>
                  )}
                </Box>
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserChat;
