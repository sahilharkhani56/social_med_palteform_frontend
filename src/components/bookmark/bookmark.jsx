import { Sidebar } from "../sidebar/sidebar";
import Grid from "@mui/material/Grid";
import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ShowBookMarks from "./showBookmarks";
import "./bookmark.css";
import { useSelector } from "react-redux";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
const bookmarks = [
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F301f2559-3245-4fd4-90c5-a8a1339dd995?alt=media&token=ce4e256c-013f-41f2-ab42-038a553d0cea",
    text: "yyyyyyyyyyyyyyyyyyyyyyyy",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F3eb163f9-1baa-438a-96a7-3c081108c34d?alt=media&token=9502e9b0-8d31-41ac-bb3e-d513d2ca7353",
    text: "yyyyyyyyyyyyyyyyyyyyyy",
  },
  {
    text: "yyyyyyyyyyyyyrrrrrrrrrrrrrrrwrtthwbwttrbwrbwhwhttwhtrhwrhtwrrrrrrtttyubwrbwbwfbewbwbwtgbwrtbwwtbwrbyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F301f2559-3245-4fd4-90c5-a8a1339dd995?alt=media&token=ce4e256c-013f-41f2-ab42-038a553d0cea",
    text: "yyyyyyyyyyyyyyyyyyyyyyyy",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F3eb163f9-1baa-438a-96a7-3c081108c34d?alt=media&token=9502e9b0-8d31-41ac-bb3e-d513d2ca7353",
    text: "yyyyyyyyyyyyyyyyyyyyyy",
  },
  { text: "yyyyyyyyyyyyyyyyy" },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F301f2559-3245-4fd4-90c5-a8a1339dd995?alt=media&token=ce4e256c-013f-41f2-ab42-038a553d0cea",
    text: "yyyyyyyyyyyyyyyyyyyyyyyy",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F3eb163f9-1baa-438a-96a7-3c081108c34d?alt=media&token=9502e9b0-8d31-41ac-bb3e-d513d2ca7353",
    text: "yyyyyyyyyyyyyyyyyyyyyy",
  },
  { text: "yyyyyyyyyyyyyyyyy" },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F301f2559-3245-4fd4-90c5-a8a1339dd995?alt=media&token=ce4e256c-013f-41f2-ab42-038a553d0cea",
    text: "yyyyyyyyyyyyyyyyyyyyyyyy",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/clickcreate-7de20.appspot.com/o/images%2F3eb163f9-1baa-438a-96a7-3c081108c34d?alt=media&token=9502e9b0-8d31-41ac-bb3e-d513d2ca7353",
    text: "yyyyyyyyyyyyyyyyyyyyyy",
  },
  { text: "yyyyyyyyyyyyyyyyy" },
  // Add more bookmarks as needed
];
const Bookmark = () => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [dataPost, setDataPost] = React.useState([]);
  const fetchBookmark = () => {
    try {

      const tempPost = [];
      const docBoomarkRef = firebase
        .firestore()
        .collection("bookmarks")
        .doc(usernameSelector.uid);
        docBoomarkRef.get().then((postId)=>{
          const postIdArray = postId.data().posts;
          postIdArray.forEach(id => {
            const docRefPost = firebase
          .firestore()
          .collection("posts")
          .doc(id);
          const getPostData=docRefPost.get();
          const {image,text}=getPostData.data();
            tempPost.push({image,text});
          });
          setDataPost(tempPost);
        })
    } catch (error) {
      toast.error(error.message);
    }
  };
  React.useEffect(() => {
    // fetchBookmark()
  }, [usernameSelector]);
  React.useEffect(()=>{
    console.log(dataPost);
  },[dataPost])
  return (
    <div className="grid-container">
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <Sidebar defaultActive={3} />
        </Grid>
        <Grid
          item
          xs={8}
          lg={6}
          height={"100vh"}
          overflow={"auto"}
          className="bookmarkPortion"
        >
          <ShowBookMarks bookmarks={bookmarks} />
        </Grid>
        {/* <Grid item xs display={{ xs: "none", lg: "block" }}>
        <Rightbar />
      </Grid> */}
      </Grid>
    </div>
  );
};

export default Bookmark;
