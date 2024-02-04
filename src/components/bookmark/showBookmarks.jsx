import React from "react";
import {
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
} from "@mui/material";

const Bookmark = ({ imageUrl, text }) => {
    return (
        <Card style={{maxHeight:'190px',minHeight:'190px'}}>
          {imageUrl ? (
            <React.Fragment>
              <CardMedia
                component="img"
                alt="Bookmark Image"
                height="140px"
                image={imageUrl}
              />
              <CardContent style={{ width: "auto", wordBreak: "break-word" }}>
                <Typography variant="body2" paragraph={true}>
                  {text}
                </Typography>
              </CardContent>
            </React.Fragment>
          ) : (
            <CardContent style={{ width: "auto", wordBreak: "break-word" }}>
              <Typography variant="body2" noWrap={false} paragraph>
                {text}
              </Typography>
            </CardContent>
          )}
        </Card>
      );
};

const ShowBookMarks = ({ bookmarks }) => {
  return (
    <Grid container spacing={2}>
      {bookmarks.map((bookmark, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Bookmark {...bookmark} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ShowBookMarks;
