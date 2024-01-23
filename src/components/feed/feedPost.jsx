import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
export default function RecipeReviewCard({
  profilePic,
  image,
  username,
  timestamp,
  message,
}) {
  return (
    <Card sx={{ maxWidth: 900 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={username}
        subheader={new Date(timestamp?.toDate()).toUTCString()}
      />
      <CardMedia component="img" height="194" image={image} alt="image" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteBorderOutlinedIcon />
        </IconButton>
        <IconButton aria-label="comment">
        <CommentOutlinedIcon/>
        </IconButton>
        <IconButton aria-label="bookmark">
          <BookmarkBorderOutlinedIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
