import * as React from "react";
import FeedPost from "./feed";
import Grid from "@mui/material/Grid";
import axios from "axios";
import "firebase/compat/firestore";
import { useSelector } from "react-redux";
import "./home.css";
import { Box, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
const getPostUrl = `${import.meta.env.VITE_BACKEND_URI}/api/getpost`;
function Home() {
  const usernameSelector = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = React.useState(true);
  const [postData, setPostData] = React.useState(null);

  const fetchPosts = async () => {
    try {
      const responsePost = await axios.get(
        `${getPostUrl}/${usernameSelector?.uid}`
      );
      Promise.resolve(responsePost);
      if (responsePost.data.posts.length > 0) {
        setPostData(responsePost.data.posts);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const funcPostDelete = ({ postId, value }) => {
    if (value === "feed") {
      const updatedItems = postData.filter((item) => item.postId !== postId);
      setPostData(updatedItems);
    }
  };
  React.useEffect(() => {
    fetchPosts();
  }, [usernameSelector]);
  return (
    <div className="grid-container">
      <Grid container>
        <Grid
          item
          xs={12}
          style={{ overflow: "auto", height: "100vh" }}
          className="postPortion"
        >
          {isLoading ? (
            <Box
              alignItems="center"
              justifyContent="center"
              sx={{
                display: "flex",
                height: "100%",
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              {postData ? (
                <React.Fragment>
                  {postData.map((data, index) => {
                    return (
                      <FeedPost
                        key={index}
                        data={data}
                        value="feed"
                        funcPostDelete={funcPostDelete}
                        isLast={index === postData.length - 1}
                      />
                    );
                  })}
                </React.Fragment>
              ) : (
                <center
                  style={{
                    display:'flex',
                    height: "100%",
                    flexDirection: "column",
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >
                  <img
                    src={`https://www.gstatic.com/dynamite/images/spacezerostate/collaboration_space_zero_state_584355656.svg`}
                    height={'300px'}
                    alt=""
                    loading="lazy"
                  />
                  <div>
                    <Typography variant="h7">EMPTY FEED</Typography>
                  </div>
                </center>
              )}
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
