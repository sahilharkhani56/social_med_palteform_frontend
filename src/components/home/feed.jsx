import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Collapse,
  Stack,
  Divider,
  Box,
} from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import moment from "moment";
import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import "./feed.css";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import ShowLikes from "./showLikes.jsx";
export default function FeedPost({ data }) {
  const usernameSelector = useSelector((state) => state.user.user);
  const [currentUserUid,setCurrentUserUid]=React.useState(usernameSelector.uid)
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(null);
  const [likeDetail,setLikeDetail]=React.useState([]);
  const [commentCount, setCommentCount] = React.useState(null);
  const [bookmarkCount, setBookmarkCount] = React.useState(null);
  const [openLikesDialog,setOpenLikesDialog]=React.useState(false);
  const milliseconds = data.createdAt.seconds * 1000 + data.createdAt.nanoseconds / 1e6;
  const dateObject = new Date(milliseconds);
  const handleImageClick = (imageUrl) => {
    setFullScreenImageUrl(imageUrl);
    setIsFullScreen(true);
  };
  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };
  const boxStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  };
  const handleLike = async () => {
    setIsLiked(true);
    try {
      const docRefUser = firebase.firestore().collection("posts").doc(data.postId);
      await docRefUser.update({
        likes:arrayUnion(currentUserUid),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleUnlike =async() => {
    setIsLiked(false);
    try{
      const docRefUser = firebase.firestore().collection("posts").doc(data.postId);
      await docRefUser.update({
        likes:arrayRemove(currentUserUid),
      });
    }catch (error) {
      toast.error(error.message);
    }
  };
  const fetchLike=async()=>{
    try{
      const docRefUser = firebase.firestore().collection("posts").doc(data.postId);
      docRefUser.onSnapshot((postDoc)=>{
        const likesArray = postDoc.data().likes
        setLikeDetail(likesArray)
        if(likesArray.length>0)
        setLikeCount(likesArray.length)
        const isLikeExits = likesArray.includes(currentUserUid);
        if(isLikeExits){
          setIsLiked(true);
        }
      })
    }catch (error) {
      toast.error(error.message);
    }
  }
  const handleOpenShowLikes=()=>{
    setOpenLikesDialog(true);
  }
  const handleCloseLikesDialog=()=>{
    setOpenLikesDialog(false);
  }
  const handleComment=()=>{
    
  }
  React.useEffect(()=>{
    fetchLike();
  },[data])
  // React.useEffect(()=>{
  //   console.log(likeDetail);
  // },[likeDetail])
  return (
    <Card sx={{ maxWidth: 900 }} className="postCard">
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={data.profile}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data.username}
        subheader={dateObject.toLocaleString()}
      />
      <CardContent style={{ paddingTop: "0" }}>
        <Typography variant="body2" color="text.secondary">
          {data.text}
        </Typography>
      </CardContent>
      {data.image ? (
        <React.Fragment>
          <CardMedia
            className="showImage"
            component="img"
            height="auto"
            onClick={() => handleImageClick(data.image)}
            image={data.image}
            alt="image"
            style={{
              height: "150%",
              borderRadius: "10px",
              objectFit: "contain",
            }}
          />
          {isFullScreen && (
            <Dialog open={true} maxWidth="xl" onClose={handleCloseFullScreen}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseFullScreen}
                aria-label="close"
                className="closeIconImage"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  m: 2,
                  backgroundColor: "#EEEDEB",
                }}
              >
                <CloseIcon />
              </IconButton>
              <CardMedia
                component="img"
                height="auto"
                image={fullScreenImageUrl}
                alt="image"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Dialog>
          )}
        </React.Fragment>
      ) : (
        ""
      )}
      <CardActions>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", paddingLeft: "4%", paddingRight: "4%" }}
        >
          <Box style={boxStyle}>
            {isLiked ? (
              <IconButton
                aria-label="like"
                className="btnForLikeFilled"
                onClick={handleUnlike}
              >
                <FavoriteIcon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="like"
                className="btnForLikeOutLined"
                onClick={handleLike}
              >
                <FavoriteBorderOutlinedIcon />
              </IconButton>
            )}
            <Typography onClick={handleOpenShowLikes}>{likeCount}</Typography>
            {openLikesDialog?( <ShowLikes
                open={openLikesDialog}
                onClose={handleCloseLikesDialog}
                likeDetail={likeDetail}
              />):null} 
          </Box>
          <Box style={boxStyle} className="btnForComment">
            <IconButton aria-label="comment" onClick={handleComment}>
              <CommentOutlinedIcon />
            </IconButton>
            <Typography>{commentCount}</Typography>
          </Box>
          <Box style={boxStyle} className="btnForbookmark">
            <IconButton aria-label="bookmark">
              <BookmarkBorderOutlinedIcon />
            </IconButton>
            <Typography>{bookmarkCount}</Typography>
          </Box>
        </Stack>
      </CardActions>
    </Card>
  );
}
