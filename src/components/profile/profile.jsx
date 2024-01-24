import { Sidebar } from "../sidebar/sidebar";
import React from "react";
import { Grid, Typography, Avatar, Button, Box, Stack } from "@mui/material";
import { ArrowBack, Padding } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { EditProfile } from "./editProfile";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import "./profile.css";
import toast from "react-hot-toast";
const urlResult = `${import.meta.env.VITE_BACKEND_URI}/api/user`;
const Profile = () => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followerCount, setfollowerCount] = React.useState(0);
  const [followingCount, setfollowingCount] = React.useState(0);
  const [postCount, setPostCount] = React.useState(0);
  const [userDetail, setUserDetail] = React.useState({});
  const { profileName } = useParams();
  let navigate = useNavigate();
  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };
  const handleFollow = async () => {
    const follower_id = usernameSelector.uid;
    const followee_id = userDetail.uid;
    const docRef = firebase.firestore().collection("connections");
    try {
      await docRef.add({
        follower_id,
        followee_id,
      });
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
    setIsFollowing((prev) => !prev);
    setfollowerCount((value) => {
      return value + 1;
    });
  };
  const handleUnfollow = async () => {
    const follower_id = userDetail.uid;
    const followee_id = usernameSelector.uid;
    const docRef = firebase.firestore().collection("connections");
    try {
      const dataConnections = await docRef
        .where("follower_id", "==", follower_id)
        .where("followee_id", "==", followee_id)
        .get();
      // console.log(dataConnections.docs.length);
      await dataConnections.docs[0].ref.delete();
    } catch (error) {
      console.log(error);
      //   toast.error(error);
    }
    setIsFollowing((prev) => !prev);
    setfollowerCount((value) => {
      return value - 1;
    });
  };

  // if (profileName === usernameSelector.username) {
  //   setIsCurrentUser(true);
  //   console.log("hello");
  // }
  const fetchInfo = async () => {
    try {
      const userDetailFetch = await axios.get(`${urlResult}/${profileName}`);
      setUserDetail(userDetailFetch.data);
    } catch (error) {
      toast.error(error);
      console.error("Error fetching user details:", error);
    }
  };
  const fetchFollwerCount = async () => {
    const docRef = firebase.firestore().collection("connections");
    const currentProfile_id = userDetail.uid;
    const followerData = await docRef
      .where("followee_id", "==", currentProfile_id)
      .get();
    setfollowerCount((value) => {
        if(!followerData.exists)return value;
      return followerData.docs.length ;
    });
  };
  const fetchFollwingCount = async () => {
    const docRef = firebase.firestore().collection("connections");
    const currentProfile_id = userDetail.uid;
    const followingData = await docRef
      .where("follower_id", "==", currentProfile_id)
      .get();
    setfollowingCount((value) => {
        if(!followingData.exists)return value;
      return followingData.docs.length;
    });
  };
  React.useEffect(() => {
    fetchInfo();
    fetchFollwerCount();
    fetchFollwingCount();
  }, [profileName, usernameSelector]);
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
                      <Typography variant="subtitle1">{postCount}</Typography>
                      <Typography variant="subtitle1">Posts</Typography>
                    </Box>
                    <Box className="followersDetail">
                      <Typography variant="subtitle1">
                        {followerCount}
                      </Typography>
                      <Typography variant="subtitle1">Followers</Typography>
                    </Box>
                    <Box className="followingDetail">
                      <Typography variant="subtitle1">
                        {followingCount}
                      </Typography>
                      <Typography variant="subtitle1">Following</Typography>
                    </Box>
                  </Stack>
                  <Grid direction="column" className="btnParent" container>
                    <Box textAlign="center">
                      {profileName === usernameSelector.username ? (
                        <EditProfile userDetail={userDetail} />
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></div>

          <p>
            Other Content Goes Here A paragraph is a series of sentences that
            are organized and coherent, and are all related to a single topic.
            Almost every piece of writing you do that is longer than a few
            sentences should be organized into paragraphs. This is because
            paragraphs show a reader where the subdivisions of an essay begin
            and end, and thus help the reader see the organization of the essay
            and grasp its main points. Paragraphs can contain many different
            kinds of information. A paragraph could contain a series of brief
            examples or a single long illustration of a general point. It might
            describe a place, character, or process; narrate a series of events;
            compare or contrast two or more things; classify items into
            categories; or describe causes and effects. Regardless of the kind
            of information they contain, all paragraphs share certain
            characteristics. One of the most important of these is A paragraph
            is a series of sentences that are organized and coherent, and are
            all related to a single topic. Almost every piece of writing you do
            that is longer than a few sentences should be organized into
            paragraphs. This is because paragraphs show a reader where the
            subdivisions of an essay begin and end, and thus help the reader see
            the organization of the essay and grasp its main points. Paragraphs
            can contain many different kinds of information. A paragraph could
            contain a series of brief examples or a single long illustration of
            a general point. It might describe a place, character, or process;
            narrate a series of events; compare or contrast two or more things;
            classify items into categories; or describe causes and effects.
            Regardless of the kind of information they contain, all paragraphs
            share certain characteristics. One of the most important of these is
            A paragraph is a series of sentences that are organized and
            coherent, and are all related to a single topic. Almost every piece
            of writing you do that is longer than a few sentences should be
            organized into paragraphs. This is because paragraphs show a reader
            where the subdivisions of an essay begin and end, and thus help the
            reader see the organization of the essay and grasp its main points.
            Paragraphs can contain many different kinds of information. A
            paragraph could contain a series of brief examples or a single long
            illustration of a general point. It might describe a place,
            character, or process; narrate a series of events; compare or
            contrast two or more things; classify items into categories; or
            describe causes and effects. Regardless of the kind of information
            they contain, all paragraphs share certain characteristics. One of
            the most important of these is A paragraph is a series of sentences
            that are organized and coherent, and are all related to a single
            topic. Almost every piece of writing you do that is longer than a
            few sentences should be organized into paragraphs. This is because
            paragraphs show a reader where the subdivisions of an essay begin
            and end, and thus help the reader see the organization of the essay
            and grasp its main points. Paragraphs can contain many different
            kinds of information. A paragraph could contain a series of brief
            examples or a single long illustration of a general point. It might
            describe a place, character, or process; narrate a series of events;
            compare or contrast two or more things; classify items into
            categories; or describe causes and effects. Regardless of the kind
            of information they contain, all paragraphs share certain
            characteristics. One of the most important of these is
          </p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
