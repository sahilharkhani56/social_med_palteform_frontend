import * as React from "react";
import Card from "@mui/material/Card";
import {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Menu,MenuItem,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined"
import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import "./feed.css";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import ShowLikes from "./showLikes.jsx";
import ShowComment from "./showComment.jsx";
import { useMediaQuery } from "@chakra-ui/react";
export default function FeedPost({ data,funcPostDelete,value ,isLast }) {
  const [isLargerThan800] = useMediaQuery("(min-width: 760px)");
  const usernameSelector = useSelector((state) => state.user.user);
  const [currentUserUid, setCurrentUserUid] = React.useState(
    usernameSelector?.uid
  );
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(null);
  const [likeDetail, setLikeDetail] = React.useState([]);
  const [commentCount, setCommentCount] = React.useState(null);
  const [commentRef, setCommentRef] = React.useState([]);
  const [bookmarkCount, setBookmarkCount] = React.useState(null);
  const [isBoomarked, setIsBookmarked] = React.useState(false);
  const [openLikesDialog, setOpenLikesDialog] = React.useState(false);
  const [openCommentDialog, setOpenCommentDialog] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPostSetting = Boolean(anchorEl);
  // const [openPostSetting,setOpenPostSetting]=React.useState(false);
  const milliseconds =
    data.createdAt.seconds * 1000 + data.createdAt.nanoseconds / 1e6;
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
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(data.postId);
        const postSnapshot=await docRefUser.get();
        if(!postSnapshot.exists)return;
      await docRefUser.update({
        likes: arrayUnion(currentUserUid),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleUnlike = async () => {
    setIsLiked(false);
    try {
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(data.postId);
        const postSnapshot=await docRefUser.get();
        if(!postSnapshot.exists)return;
      await docRefUser.update({
        likes: arrayRemove(currentUserUid),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchLike = async () => {
    try {
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(data.postId);
        const postSnapshot=await docRefUser.get();
        if(!postSnapshot.exists)return;
      docRefUser.onSnapshot((postDoc) => {
        if(!postDoc.exists)return;
        const likesArray = postDoc.data().likes;
        setLikeDetail(likesArray);
        if (likesArray.length > 0) setLikeCount(likesArray.length);
        if (likesArray.length == 0) setLikeCount(null);

        const isLikeExits = likesArray.includes(currentUserUid);
        if (isLikeExits) {
          setIsLiked(true);
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchComment = async () => {
    try {
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(data.postId);
        const postSnapshot=await docRefUser.get();
        if(!postSnapshot.exists)return;
      docRefUser.onSnapshot((postDoc) => {
        if(!postDoc.exists)return;
        const commentArray = postDoc.data().comments;
        setCommentRef(commentArray);
        if (commentArray.length > 0) setCommentCount(commentArray.length);
        if (commentArray.length == 0) setCommentCount(null);
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchBookmark = async () => {
    try {
      const docRefBookmark = firebase
        .firestore()
        .collection("posts")
        .doc(data.postId);
        const postSnapshot=await docRefBookmark.get();
        if(!postSnapshot.exists)return;
      docRefBookmark.onSnapshot((bookmarkPost) => {
        if(!bookmarkPost.exists)return;
        const bookmarkArray = bookmarkPost.data().bookmarks;
        if (bookmarkArray.length > 0) setBookmarkCount(bookmarkArray.length);
        if (bookmarkArray.length == 0) setBookmarkCount(null);
        const isBookmarkExits = bookmarkArray.includes(currentUserUid);
        if (isBookmarkExits) {
          setIsBookmarked(true);
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleOpenShowLikes = () => {
    setOpenLikesDialog(true);
  };
  const handleCloseLikesDialog = () => {
    setOpenLikesDialog(false);
  };
  const handleOpenCommentDialog = () => {
    setOpenCommentDialog(true);
  };
  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
  };
  const handleAddBookmarked = async () => {
    setIsBookmarked(true);
    try {
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(data.postId);
        const postSnapshot=await docRefUser.get();
        if(!postSnapshot.exists)return;
      await docRefUser.update({
        bookmarks: arrayUnion(currentUserUid),
      });
      const docBookmarkCollectionRef = firebase
        .firestore()
        .collection("bookmarks")
        .doc(currentUserUid);
      const bookmarkSnapshot = await docBookmarkCollectionRef.get();
      if (!bookmarkSnapshot.exists) {
        await docBookmarkCollectionRef.set({
          posts: [data.postId],
        });
      } else {
        await docBookmarkCollectionRef.update({
          posts: arrayUnion(data.postId),
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleRemoveBookmarked = async () => {
    setIsBookmarked(false);
    try {
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(data.postId);
      await docRefUser.update({
        bookmarks: arrayRemove(currentUserUid),
      });
      const docBookmarkCollectionRef = firebase
        .firestore()
        .collection("bookmarks")
        .doc(currentUserUid);
      await docBookmarkCollectionRef.update({
        posts: arrayRemove(data.postId),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleClickOpenPostSetting = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickClosePostSetting = () => {
    setAnchorEl(null);
  };
  const handleClickPostDelete=async()=>{
    setAnchorEl(null);
    const postId=data.postId;
    try{
      const docPostRef=firebase.firestore().collection('posts').doc(postId);
      const snapshotPost=await docPostRef.get();
      if(!snapshotPost.exists)return;
      const {bookmarks}=snapshotPost.data();
      bookmarks.forEach(userId => {
        const docBookmarkRef=firebase.firestore().collection('bookmarks').doc(userId);
        docBookmarkRef.update({
          posts: arrayRemove(postId),
        });
      });

      await docPostRef.delete();
      funcPostDelete({postId,value})
    }catch(error){
      toast.error(error.message);
    }
  }
  React.useEffect(() => {
    fetchLike();
    fetchComment();
    fetchBookmark();
  }, [data]);
  // React.useEffect(() => {
  //  console.log(bookmarkCount);
  // }, [bookmarkCount]);
  // React.useEffect(()=>{
  //   console.log(likeDetail);
  // },[likeDetail])
  return (
    <Card sx={{ maxWidth: 900 }} className={isLargerThan800===false?'postCardMobile postCard':'postCard'}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={data.profile}
          />
        }
        action={
          <React.Fragment>
            <IconButton
              aria-label="settings"
              id="basic-button"
              aria-controls={openPostSetting ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openPostSetting ? "true" : undefined}
              onClick={handleClickOpenPostSetting}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openPostSetting}
              onClose={handleClickClosePostSetting}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClickClosePostSetting}>Report</MenuItem>
              <MenuItem onClick={handleClickPostDelete} disabled={data.username===usernameSelector?.username?false:true} style={{color:'red'}}>Delete Post</MenuItem>
            </Menu>
          </React.Fragment>
        }
        title={data.username}
        subheader={dateObject.toLocaleString()}
      />
      <CardContent style={{ paddingTop: "0", wordBreak: "break-word" }}>
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
            {openLikesDialog ? (
              <ShowLikes
                open={openLikesDialog}
                onClose={handleCloseLikesDialog}
                postData={data}
              />
            ) : null}
          </Box>
          <Box style={boxStyle} className="btnForComment">
            <IconButton aria-label="comment" onClick={handleOpenCommentDialog}>
              <CommentOutlinedIcon />
            </IconButton>
            <Typography>{commentCount}</Typography>
            {openCommentDialog ? (
              <ShowComment
                open={openCommentDialog}
                onClose={handleCloseCommentDialog}
                postData={data}
              />
            ) : null}
          </Box>
          <Box style={boxStyle} className="btnForbookmark">
            {isBoomarked ? (
              <IconButton
                aria-label="bookmark"
                sx={{ color: "black" }}
                onClick={handleRemoveBookmarked}
              >
                <BookmarkIcon />
              </IconButton>
            ) : (
              <IconButton aria-label="bookmark" onClick={handleAddBookmarked}>
                <BookmarkBorderOutlinedIcon />
              </IconButton>
            )}

            <Typography>{bookmarkCount}</Typography>
          </Box>
        </Stack>
      </CardActions>
    </Card>
  );
}
