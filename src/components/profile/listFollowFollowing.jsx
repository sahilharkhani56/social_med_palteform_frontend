import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
const ShowList = ({ DetailEx }) => {
    return (
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} className="listFollowFollowing">
      {DetailEx.map((data, index) => (
        <ListItem alignItems="flex-start" key={index}>
          <ListItemAvatar sx={{marginTop:0}}>
            <Avatar src={data.profile || ""} />
          </ListItemAvatar>
          <Box>
            <Typography variant="h7" fontWeight={600} component="div" color="text.primary">
              {data.username}
            </Typography>
            <Typography variant="body2" noWrap component="div" color="text.primary">
              {data.bio}
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default ShowList;
