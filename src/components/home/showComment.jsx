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
  DialogActions,
  Stack,
  TextField,
  OutlinedInput,
  Divider,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { arrayUnion } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import formatTimeDifference from "../../helper/formatTimestamp.js";
const ShowComment = ({ open, onClose, postData }) => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [DetailEx, setDetailEx] = React.useState([]);
  const [commentDisable, setCommentDisable] = React.useState(true);
  const [CurrentCommentValue, setCurrentCommentValue] = React.useState("");
  const [commentCount, setCommentCount] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [commentRef, setCommentRef] = React.useState([]);
  const [commentDetail, setCommentDetail] = React.useState([]);
  const dataExtraction = async (commentRef) => {
    var tempInformation = [];
    const userPromises = commentRef.map(async (id) => {
      const docRefComment = firebase.firestore().collection("comments").doc(id);
      const snapshotComment = await docRefComment.get();
      const commentDataGet = snapshotComment.data();
      const { commentText, createdAt, createdBy } = commentDataGet;
      const docRefUser = firebase
        .firestore()
        .collection("users")
        .doc(createdBy);
      const snapshotUser = await docRefUser.get();
      const userDataGet = snapshotUser.data();
      const { username, profile } = userDataGet;
      const milliseconds =
        createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6;
      const timestamp = new Date(milliseconds);
      // const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
      const formattedTime = formatTimeDifference(timestamp);
      tempInformation.push({
        commentText,
        createdAt,
        formattedTime,
        username,
        profile,
      });
    });
    await Promise.all(userPromises);
    tempInformation.sort((a, b) => b.createdAt - a.createdAt);
    setDetailEx(tempInformation);
    setCommentDetail(tempInformation);
    setIsLoading(false);
  };
  const handleChangeWriteComment = (event) => {
    if (event.target.value.length > 0) {
      setCommentDisable(false);
      setCurrentCommentValue(event.target.value);
    } else {
      setCommentDisable(true);
      setCurrentCommentValue("");
    }
  };
  const handleSubmitComment = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const commentField = formJson.commentField;
    const docRefComment = firebase.firestore().collection("comments");
    try {
      const docCommentData = await docRefComment.add({
        commentText: commentField,
        createdBy: usernameSelector?.uid,
        createdAt: new Date(),
      });
      const createdCommentRef = docCommentData.id;
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(postData.postId);
      await docRefUser.update({
        comments: arrayUnion(createdCommentRef),
      });
    } catch (error) {
      toast.error(error.message);
    }
    setCurrentCommentValue("");
    setCommentDisable(true);
  };
  const fetchComment = async () => {
    try {
      const docRefUser = firebase
        .firestore()
        .collection("posts")
        .doc(postData.postId);
      docRefUser.onSnapshot((postDoc) => {
        const commentArray = postDoc.data().comments;
        setCommentRef(commentArray);
        if (commentArray.length > 0) setCommentCount(commentArray.length);
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  React.useEffect(() => {
    fetchComment();
  }, [open]);
  React.useEffect(() => {
    dataExtraction(commentRef);
  }, [commentRef]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ padding: "5px 10px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Comments</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider component="" sx={{ width: "100%" }} />
      <DialogContent sx={{ padding: "0px" }}>
        {isLoading ? (
          <Box
            alignItems="center"
            justifyContent="center"
            sx={{
              display: "flex",
              height: "244px",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              height: "244px",
              bgcolor: "background.paper",
            }}
            className="listFollowFollowing"
          >
            {commentDetail?.map((data, index) => (
              <ListItem alignItems="flex-start" key={index}>
                <ListItemAvatar sx={{ marginTop: 0 }}>
                  <Avatar src={data.profile || ""} />
                </ListItemAvatar>
                <Box sx={{ margin: "auto 0" }}>
                  <Typography
                    variant="h7"
                    fontWeight={600}
                    component="div"
                    color="text.primary"
                  >
                    {data.username}
                    <span
                      className="timestamp"
                      style={{
                        fontSize: "13px",
                        fontWeight: "normal",
                        marginLeft: "4px",
                        color: "grey",
                      }}
                    >
                      {data.formattedTime}
                    </span>
                  </Typography>
                  <Typography
                    variant="body2"
                    noWrap
                    component="div"
                    color="text.primary"
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {data.commentText}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <Divider component="" sx={{ width: "100%" }} />
      <DialogActions>
        <Stack
          direction="row"
          spacing={0}
          alignItems="center"
          sx={{ width: "100%" }}
          component="form"
          onSubmit={handleSubmitComment}
        >
          <Box sx={{ height: "40px" }}>
            <Avatar src={usernameSelector?.profile} alt="image" />
          </Box>
          <OutlinedInput
            autoComplete="off"
            onChange={handleChangeWriteComment}
            value={CurrentCommentValue}
            sx={{
              height: "40px",
              flex: 1,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            placeholder={`Add a comment for ${postData.username}...`}
            name="commentField"
          />
          {commentDisable ? (
            <IconButton aria-label="post" sx={{ height: "40px" }} disabled>
              <SendIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="post" sx={{ height: "40px" }} type="submit">
              <SendIcon sx={{ color: "black" }} />
            </IconButton>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ShowComment;
