import { Sidebar } from "../sidebar/sidebar";
import React from "react";
import { Grid, Typography, Avatar, Button, Box, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { EditProfile } from "./editProfile";
import "./profile.css";
const urlResult = `${import.meta.env.VITE_BACKEND_URI}/api/user`;
const Profile = () => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [isFollowing, setIsFollowing] = React.useState(false);
  let navigate = useNavigate();
  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };
  const [userDetail, setUserDetail] = React.useState({});
  const { profileName } = useParams();
  // if (profileName === usernameSelector.username) {
  //   setIsCurrentUser(true);
  //   console.log("hello");
  // }
  const fetchInfo = async () => {
    try {
      const userDetailFetch = await axios.get(`${urlResult}/${profileName}`);
      setUserDetail(userDetailFetch.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  React.useEffect(() => {
    fetchInfo();
  }, [profileName]);
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
                      <Typography variant="subtitle1">Posts</Typography>
                      <Typography variant="subtitle1">Posts</Typography>
                    </Box>
                    <Box className="followersDetail">
                      <Typography variant="subtitle1">Followers</Typography>
                      <Typography variant="subtitle1">Followers</Typography>
                    </Box>
                    <Box className="followingDetail">
                      <Typography variant="subtitle1">Following</Typography>
                      <Typography variant="subtitle1">Following</Typography>
                    </Box>
                  </Stack>
                  <Grid direction="column" className="btnParent" container>
                    <Box textAlign="center">
                      {profileName === usernameSelector.username ? (
                        <EditProfile userDetail={userDetail}/>
                      ) : (
                        <>
                          {isFollowing ? (
                            <Button
                              variant="contained"
                              color="primary"
                              className="btnboth unfollowBtn"
                              onClick={handleFollowToggle}
                            >
                              Unfollow
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              className="btnboth followBtn"
                              onClick={handleFollowToggle}
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" style={{ marginTop: 10 }}>
              This is the bio section. It can contain a brief description of the
              user.
            </Typography>
          </div>

          {/* Other Content Goes Here */}
          {/* For example, display user's posts, additional information, etc. */}
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
