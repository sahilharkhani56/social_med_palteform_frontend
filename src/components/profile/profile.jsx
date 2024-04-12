import { Sidebar } from "../sidebar/sidebar";
import React, { useRef } from "react";
import {
  Grid,
  Typography,
  Avatar,
  Button,
  Box,
  Stack,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import { ArrowBack, MoreVert } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { EditProfile } from "./editProfile";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import ShowFollowFollowing from "./showFollowFollowing.jsx";
import "./profile.css";
import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
import FeedPost from "../home/feed.jsx";
import toast from "react-hot-toast";
var userDetailFetch;
const docRef = firebase.firestore().collection("connections");
const getPostUrl = `${import.meta.env.VITE_BACKEND_URI}/api/getCurrentuserPost`;
const getBookmarkUrl = `${
  import.meta.env.VITE_BACKEND_URI
}/api/getCurrentuserBookmark`;
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Profile = () => {
  const firstUpdate = useRef(true);
  const usernameSelector = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const navigateTo = useNavigate();
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [followerCount, setfollowerCount] = React.useState(0);
  const [followerDetail, setFollowerDetail] = React.useState([]);
  const [followingDetail, setFollowingDetail] = React.useState([]);
  const [followingCount, setfollowingCount] = React.useState(0);
  const [postCount, setPostCount] = React.useState(0);
  const [userDetail, setUserDetail] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const { profileName } = useParams();
  const [postData, setPostData] = React.useState(null);
  const [bookMarkData, setBookMarkData] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openE = Boolean(anchorEl);
  let navigate = useNavigate();
  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };
  const handleShowFollowerFollowing = () => {
    setOpen(true);
  };
  const handleCloseFollowerFollowing = () => {
    setOpen(false);
  };
  const handleFollow = async () => {
    const follower_id = usernameSelector?.uid;
    const followee_id = userDetail.uid;
    try {
      await docRef.add({
        follower_id,
        followee_id,
      });
    } catch (error) {
      toast.error(error.message);
    }
    setIsFollowing((prev) => !prev);
  };
  const handleUnfollow = async () => {
    const follower_id = usernameSelector?.uid;
    const followee_id = userDetail.uid;
    try {
      const dataConnections = await docRef
        .where("follower_id", "==", follower_id)
        .where("followee_id", "==", followee_id)
        .get();
      await dataConnections.docs[0].ref.delete();
    } catch (error) {
      toast.error(error.message);
    }
    setIsFollowing((prev) => !prev);
  };
  const fetchInfo = async () => {
    // setIsLoading(true);
    try {
      const docRefUser = firebase.firestore().collection("users");
      const snapshot = await docRefUser
        .where("username", "==", profileName)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            userDetailFetch = doc.data();
            const uid = "uid";
            userDetailFetch[uid] = doc.id;
          });
          setUserDetail(userDetailFetch);
        });
    } catch (error) {
      toast.error(error.message);
    }
    // setIsLoading(false);
  };
  const isFollowingCheck = async () => {
    // setIsLoading(true);
    try {
      const follower_id = usernameSelector?.uid;
      const followee_id = userDetail?.uid;
      if (followee_id && follower_id) {
        const dataConnections = await docRef
          .where("follower_id", "==", follower_id)
          .where("followee_id", "==", followee_id)
          .get();
        if (dataConnections.docs[0]) {
          setIsFollowing((prev) => !prev);
        }
      }
      // setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchFollowerCountDetail = async () => {
    // setIsLoading(true);
    const currentProfile_id = userDetail?.uid;
    if (currentProfile_id) {
      try {
        const observer = docRef
          .where("followee_id", "==", currentProfile_id)
          .onSnapshot(
            (querySnapshot) => {
              var tempFollower = [];
              querySnapshot.forEach((data) => {
                tempFollower.push(data.data().follower_id);
              });
              setFollowerDetail(tempFollower);
              setfollowerCount((value) => {
                return querySnapshot.size;
              });
            },
            (error) => {
              toast.error(error.message);
            }
          );
      } catch (error) {
        toast.error(error.message);
      }
      // setIsLoading(false);
    }
  };
  const fetchFollowingCountDetail = async () => {
    // setIsLoading(true);
    const currentProfile_id = userDetail?.uid;
    if (currentProfile_id) {
      try {
        const observer = docRef
          .where("follower_id", "==", currentProfile_id)
          .onSnapshot(
            (querySnapshot) => {
              var tempFollowing = [];
              querySnapshot.forEach((data) => {
                tempFollowing.push(data.data().followee_id);
              });
              setFollowingDetail(tempFollowing);
              setfollowingCount((value) => {
                return querySnapshot.size;
              });
            },
            (error) => {
              toast.error(error.message);
            }
          );
      } catch (error) {
        toast.error(error.message);
      }
      // setIsLoading(false);
    }
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchPosts = async () => {
    try {
      if (userDetail.uid != undefined) {
        const responsePost = await axios.get(`${getPostUrl}/${userDetail.uid}`);
        await Promise.resolve(responsePost);
        if (responsePost.data.posts.length > 0) {
          setPostData(responsePost.data.posts);
        }

        setPostCount(responsePost.data.posts.length);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchBookmark = async () => {
    try {
      if (userDetail.uid != undefined) {
        const responseBookmark = await axios.get(
          `${getBookmarkUrl}/${userDetail.uid}`
        );
        await Promise.resolve(responseBookmark);
        if (responseBookmark.data.posts.length > 0) {
          setBookMarkData(responseBookmark.data.posts);
        }
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const funcPostDelete = ({ postId, value }) => {
    if (value === "post") {
      const updatedItems = postData.filter((item) => item.postId !== postId);
      setPostData(updatedItems);
    } else {
      const updatedItems = bookMarkData.filter(
        (item) => item.postId !== postId
      );
      setBookMarkData(updatedItems);
    }
  };
  const handleClose = () => {
    setAnchorEl(null)
  };
  const signOutAuth = () => {
    setAnchorEl(null);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logout());
        navigateTo("/login");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const openLogout = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // React.useEffect(() => {
  //   fetchPosts();
  // }, [usernameSelector]);
  React.useEffect(() => {
    fetchInfo();
  }, [profileName, usernameSelector]);
  React.useEffect(() => {
    // setIsLoading(true);
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    const fetchData = async () => {
      await Promise.all([
        fetchFollowerCountDetail(),
        fetchFollowingCountDetail(),
        isFollowingCheck(),
        fetchPosts(),
        fetchBookmark(),
      ]);
      // Set isLoading to false after all data is fetched.
      setIsLoading(false);
    };

    fetchData();
  }, [userDetail]);
  const addSchedule=()=>{
    navigateTo('/schedule')
  }
  // React.useEffect(() => {
  //   const d = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1900);
  //   return () => {
  //     clearTimeout(d);
  //   };
  // }, []);
  return (
    <div className="grid-container">
      <Grid container>
        <Grid item xs={12} className="profilePortion">
          <AppBar component="nav" position="sticky" className="appBarProfile">
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => navigate(-1)}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                className="appBarUsername"
              >
                {profileName}
              </Typography>
              {profileName === usernameSelector?.username ? (
                <React.Fragment>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    color="inherit"
                    aria-label="more options"
                    onClick={openLogout}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openE}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                  <MenuItem onClick={addSchedule} >
                      Add Schedule
                    </MenuItem>
                    <MenuItem onClick={signOutAuth} style={{ color: "red" }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              ) : null}
            </Toolbar>
          </AppBar>

          {isLoading ? (
            <Box
              alignItems="center"
              justifyContent="center"
              sx={{
                display: "flex",
                height: "calc(100% - 48px)",
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              <Box sx={{ flexGrow: 1 }} className="outerBoxProfile">
                <Grid container spacing={3}>
                  <Grid item xs="auto">
                    <Avatar
                      src={userDetail?.profile || ""}
                      alt=""
                      className="profilePhoto"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    container
                    className="interDetails"
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid
                      direction="column"
                      container
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Stack direction="row" spacing={2}>
                        <Box className="postDetail">
                          <Typography variant="subtitle1" align="center">
                            {postCount}
                          </Typography>
                          <Typography variant="subtitle1" align="center">
                            Posts
                          </Typography>
                        </Box>
                        <Box
                          className="followersDetail"
                          onClick={handleShowFollowerFollowing}
                          sx={{ cursor: "pointer" }}
                        >
                          <Typography variant="subtitle1" align="center">
                            {followerCount}
                          </Typography>
                          <Typography variant="subtitle1" align="center">
                            Followers
                          </Typography>
                        </Box>
                        <Box
                          className="followingDetail"
                          onClick={handleShowFollowerFollowing}
                          sx={{ cursor: "pointer" }}
                        >
                          <Typography variant="subtitle1" align="center">
                            {followingCount}
                          </Typography>
                          <Typography variant="subtitle1" align="center">
                            Following
                          </Typography>
                        </Box>
                      </Stack>
                      {open ? (
                        <ShowFollowFollowing
                          open={open}
                          onClose={handleCloseFollowerFollowing}
                          followerDetail={followerDetail}
                          followingDetail={followingDetail}
                        />
                      ) : (
                        ""
                      )}
                      <Grid direction="column" className="btnParent" container>
                        <Box textAlign="center">
                          {profileName === usernameSelector?.username ? (
                            <EditProfile userDetail={userDetail}></EditProfile>
                          ) : (
                            <>
                              {isFollowing ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className="btnboth unfollowBtn"
                                  onClick={handleUnfollow}
                                >
                                  Unfollow
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className="btnboth followBtn"
                                  onClick={handleFollow}
                                >
                                  Follow
                                </Button>
                              )}
                            </>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Stack direction="column" spacing={1} pl={"3%"} pr={"3%"}>
                <Typography variant="h6" fontWeight={700}>
                  {userDetail?.username}
                </Typography>
                <Typography variant="body1" style={{ marginTop: "0px" }}>
                  {userDetail?.bio}
                </Typography>
              </Stack>
              <AppBar
                position="static"
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: "none",
                  marginTop: "2%",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Posts" {...a11yProps(0)} />
                  <Tab label="bookmarks" {...a11yProps(1)} />
                </Tabs>
              </AppBar>

              <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
                <CustomTabPanel value={value} index={0}>
                  {postData ? (
                    <React.Fragment>
                      {postData.map((data, index) => {
                        return (
                          <FeedPost
                            key={index}
                            data={data}
                            funcPostDelete={funcPostDelete}
                            value="post"
                          />
                        );
                      })}
                    </React.Fragment>
                  ) : (
                    <center>
                      <img
                        src={`https://www.gstatic.com/dynamite/images/cr/onboardingzerostate/space_onboarding.svg`}
                        alt=""
                        loading="lazy"
                      />
                      <div>
                        <Typography variant="h7">NO POSTS</Typography>
                      </div>
                    </center>
                  )}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  {bookMarkData ? (
                    <React.Fragment>
                      {bookMarkData.map((data, index) => {
                        return (
                          <FeedPost
                            key={index}
                            data={data}
                            funcPostDelete={funcPostDelete}
                            value="bookmark"
                          />
                        );
                      })}
                    </React.Fragment>
                  ) : (
                    <center>
                      <img
                        src={`https://www.gstatic.com/dynamite/images/cr/empty_starred.svg`}
                        alt=""
                        loading="lazy"
                      />
                      <div>
                        <Typography variant="h7">NO BOOKMARKS</Typography>
                      </div>
                    </center>
                  )}
                </CustomTabPanel>
                {/* <SwipeableViews
                  index={value}
                  onChangeIndex={handleChangeIndex}
                  className="slider"
                >
                  <TabPanel value={value} index={0}>
                    {postData ? (
                      <React.Fragment>
                        {postData.map((data, index) => {
                          return (
                            <FeedPost
                              key={index}
                              data={data}
                              funcPostDelete={funcPostDelete}
                              value="post"
                            />
                          );
                        })}
                      </React.Fragment>
                    ) : (
                      <center>
                        <img
                          src={`https://www.gstatic.com/dynamite/images/cr/onboardingzerostate/space_onboarding.svg`}
                          alt=""
                          loading="lazy"
                        />
                        <div>
                          <Typography variant="h7">NO POSTS</Typography>
                        </div>
                      </center>
                    )}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {bookMarkData ? (
                      <React.Fragment>
                        {bookMarkData.map((data, index) => {
                          return (
                            <FeedPost
                              key={index}
                              data={data}
                              funcPostDelete={funcPostDelete}
                              value="bookmark"
                            />
                          );
                        })}
                      </React.Fragment>
                    ) : (
                      <center>
                        <img
                          src={`https://www.gstatic.com/dynamite/images/cr/empty_starred.svg`}
                          alt=""
                          loading="lazy"
                        />
                        <div>
                          <Typography variant="h7">NO BOOKMARKS</Typography>
                        </div>
                      </center>
                    )}
                  </TabPanel>
                </SwipeableViews> */}
              </Box>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
