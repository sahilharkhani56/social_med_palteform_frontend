import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import firebase, { auth, db } from "../../setup/firebase.js";
import axios from "axios";
import "firebase/compat/firestore";
const ShowLikes = ({ open, onClose,postData }) => {
  const [DetailEx, setDetailEx] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [likeDetail,setLikeDetail]=React.useState([]);
  const fetchLike=async()=>{
    try{
      const docRefUser = firebase.firestore().collection("posts").doc(postData.postId);
      docRefUser.onSnapshot((postDoc)=>{
        const likesArray = postDoc.data().likes
        setLikeDetail(likesArray)
      })
    }catch (error) {
      toast.error(error.message);
    }
  }
  const dataExtraction = async (information) => {
    var tempInformation = [];
    const userPromises = information.map(async (id) => {
      const docRefUser = firebase.firestore().collection("users").doc(id);
      const snapshot = await docRefUser.get();

      if (snapshot.exists) {
        const { username, profile, bio } = snapshot.data();
        tempInformation.push({ username, profile, bio,id });
      }
    });
    await Promise.all(userPromises);
    setDetailEx(tempInformation);
    setIsLoading(false)
  };
  React.useEffect(() => {
    fetchLike()
    dataExtraction(likeDetail);
  }, [open]);
  React.useEffect(() => {
    dataExtraction(likeDetail);
  }, [likeDetail]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{padding:'5px 10px'}} >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Liked by</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider component="" sx={{ width: "100%" }} />
      <DialogContent sx={{padding:'0px'}}>
      {isLoading ? (
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      display: "flex",
                      height: "300px",
                      width: "100%",
                    }}
                  >
                    <CircularProgress/>
                  </Box>
                ) : (     
        <List
          sx={{ width: "100%", maxWidth: 360,height:'300px', bgcolor: "background.paper"}}
          className="listFollowFollowing"
        >
          {DetailEx?.map((data, index) => (
            <ListItem alignItems="flex-start" key={index}>
              <ListItemAvatar sx={{ marginTop: 0 }}>
                <Avatar src={data.profile || ""} />
              </ListItemAvatar>
              <Box sx={{margin:'auto 0'}}>
                <Typography
                  variant="h7"
                  fontWeight={600}
                  component="div"
                  color="text.primary"
                >
                  {data.username}
                </Typography>
                {/* <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  color="text.primary"
                >
                  {data.bio}
                </Typography> */}
              </Box>
            </ListItem>
          ))}
        </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShowLikes;
