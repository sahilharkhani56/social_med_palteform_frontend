import { Sidebar } from "../sidebar/sidebar";
import React from "react";
import { Grid, Typography, Avatar, Button, Box, Stack } from "@mui/material";
import { ArrowBack, Padding } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { EditProfile } from "./editProfile";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import ShowFollowFollowing from "./showFollowFollowing.jsx";
import "./profile.css";
var userDetailFetch;
const docRef = firebase.firestore().collection("connections");
const Profile = () => {
  const usernameSelector = useSelector((state) => state.user.user);
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
    const follower_id = usernameSelector.uid;
    const followee_id = userDetail.uid;
    try {
      await docRef.add({
        follower_id,
        followee_id,
      });
    } catch (error) {
      console.log(error);
    }
    setIsFollowing((prev) => !prev);
  };
  const handleUnfollow = async () => {
    const follower_id = usernameSelector.uid;
    const followee_id = userDetail.uid;
    try {
      const dataConnections = await docRef
        .where("follower_id", "==", follower_id)
        .where("followee_id", "==", followee_id)
        .get();
      await dataConnections.docs[0].ref.delete();
    } catch (error) {
      console.log(error);
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
            (err) => {
              console.log(`Encountered error: ${err}`);
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
            (err) => {
              console.log(`Encountered error: ${err}`);
            }
          );
      } catch (error) {
        toast.error(error.message);
      }
      // setIsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchInfo();
  }, [profileName, usernameSelector]);
  React.useEffect(() => {
    // setIsLoading(true);
    const fetchData = async () => {
      await Promise.all([
        fetchFollowerCountDetail(),
        fetchFollowingCountDetail(),
        isFollowingCheck(),
      ]);
      // Set isLoading to false after all data is fetched.
      setIsLoading(false);
    };

    fetchData();
  }, [userDetail]);
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
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <Sidebar defaultActive={4} />
        </Grid>
        <Grid item xs={8} lg={6} className="profilePortion">
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
                          {profileName === usernameSelector.username ? (
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
              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              ></div>

              <p>
                Other Content Goes Here A paragraph is a series of sentences
                that are organized and coherent, and are all related to a single
                topic. Almost every piece of writing you do that is longer than
                a few sentences should be organized into paragraphs. This is
                because paragraphs show a reader where the subdivisions of an
                essay begin and end, and thus help the reader see the
                organization of the essay and grasp its main points. Paragraphs
                can contain many different kinds of information. A paragraph
              </p> */}
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
