import { Sidebar } from "../sidebar/sidebar";
import * as React from "react";
import FeedPost from "./feed";
import Grid from "@mui/material/Grid";
import firebase, { auth, db } from "../../setup/firebase.js";
import axios from "axios";
import "firebase/compat/firestore";
import { useSelector } from "react-redux";
import "./home.css";
import { Box, CircularProgress } from "@mui/material";
const getPostUrl = `${import.meta.env.VITE_BACKEND_URI}/api/getpost`;
function Home() {
  const usernameSelector = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = React.useState(true);
  const [postData, setPostData] = React.useState([]);
  const fetchPosts = async () => {
    const responsePost = await axios.get(
      `${getPostUrl}/${usernameSelector.uid}`
    );
    setPostData(responsePost.data.posts);
    setIsLoading(false);
  };
  React.useEffect(() => {
    fetchPosts();
  }, [usernameSelector]);
  React.useEffect(() => {
    console.log(postData);
  }, [postData]);
  return (
    <div className="grid-container">
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <Sidebar defaultActive={0} />
        </Grid>
        <Grid
          item
          xs={8}
          lg={6}
          style={{ paddingLeft: "0", overflow: "auto", height: "100vh" }}
          className="postPortion"
        >
          {isLoading ? (
            <Box
              alignItems="center"
              justifyContent="center"
              sx={{
                display: "flex",
                height:'100%',
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              {postData.map((data, index) => {
                return (
                  <FeedPost
                    key={index}
                    profilePic={data?.profile}
                    image={data?.image}
                    username={data?.username}
                    message={data?.text}
                    timestamp={data?.createdAt}
                    data={data}
                  />
                );
              })}
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
