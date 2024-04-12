import Grid from "@mui/material/Grid";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { AppBar, Box, TextField, Toolbar } from "@mui/material";
import firebase, { auth, db } from "../../setup/firebase.js";
import IconButton from "@mui/material/IconButton";
import "firebase/compat/firestore";
import "./allContect.css";
import { useSelector } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const AllContect = () => {
  const navigateTo = useNavigate();
  const usernameSelector = useSelector((state) => state.user.user);
  const [users, setUsers] = React.useState([]);
  const [filterUser,setFilterUser]=React.useState([]);
  const getAllUsers = async () => {
    const docRef = firebase.firestore().collection("users");
    const snapshot = await docRef.get();
    const usersTemp = [];
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const { username, profile,bio } = userData;
      const uid = doc.id;
      if (!(uid === usernameSelector?.uid)) {
        usersTemp.push({ username, profile, uid,bio });
      }
    });
    setUsers(usersTemp);
    setFilterUser(usersTemp);
  };
  const handleOpenProfileChat=(data,index)=>{
    navigateTo(`/messages/${data.username}`);
  }
  const handleChangeSearchField = (event) => {
    const query = event.target.value;
    var updatedList = [...users];
    updatedList = updatedList.filter((item) => {
      return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    setFilterUser(updatedList);
  };
  React.useEffect(() => {
    getAllUsers();
  }, [usernameSelector]);
  // React.useEffect(() => {
  //   console.log(users);
  // }, [users]);
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
                sx={{ mr: 2 }}
                onClick={() => navigateTo('/messages')}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                className="appBarUsername"
              >
                All Users
              </Typography>
              
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
                <Box key={index} onClick={()=>handleOpenProfileChat(data,index)}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                    className="userList"

                  >
                    <ListItemAvatar sx={{ marginTop: 0 }}>
                      <Avatar alt="" src={data.profile} />
                    </ListItemAvatar>
                    <Box sx={{ height: "40px",alignItems:'center'}}>
                      <Typography
                        variant="h7"
                        fontWeight={600}
                        component="div"
                        color="text.primary"
                      >
                        {data.username}
                      </Typography>
                      <Typography variant="body2" noWrap component="div" color="text.primary">
              {data.bio}
            </Typography>
                    </Box>
                    {/* <ListItemText
                primary={data.username}
              /> */}
                  </ListItem>
                  <Divider component="li" />
                </Box>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default AllContect;
