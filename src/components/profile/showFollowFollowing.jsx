import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
  Box,
  Tab,
  Tabs,
  AppBar,
} from "@mui/material";
import firebase, { auth, db } from "../../setup/firebase.js";
import axios from "axios";
import "firebase/compat/firestore";
import { useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@mui/icons-material/Close";
import "./showFollowFollowing.css";
import ListFollowFollowing from "./listFollowFollowing.jsx";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
const ShowFollowFollowing = ({
  open,
  onClose,
  followerDetail,
  followingDetail,
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [followerDetailEx, setFollowerDetailEx] = React.useState([]);
  const [followingDetailEx, setFollowingDetailEx] = React.useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const dataExtraction = async (information, tp) => {
    var tempInformation = [];
    information.forEach((id) => {
      try {
        const docRefUser = firebase.firestore().collection("users").doc(id);
        const snapshot = docRefUser.onSnapshot((querySnapshot) => {
          const { username, profile, bio } = querySnapshot.data();
          tempInformation.push({ username, profile, bio });
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      tp === "follower"
        ? setFollowerDetailEx(tempInformation)
        : setFollowingDetailEx(tempInformation);
    });
  };
  const followerDetailDataExtraction = () => {
    dataExtraction(followerDetail, "follower");
  };
  const followingDetailDataExtraction = () => {
    dataExtraction(followingDetail, "following");
  };
  React.useEffect(() => {
    followerDetailDataExtraction();
    followingDetailDataExtraction();
  }, [open]);
  React.useEffect(() => {
    const d = setTimeout(() => {
      setIsLoading(false);
    }, 1900);
    return () => {
      clearTimeout(d);
    };
  }, [open]);
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <AppBar
            position="static"
            sx={{ bgcolor: "background.paper", boxShadow: "none" }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Followers" {...a11yProps(0)} />
              <Tab label="Following" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "300px", minHeight: "300px" }}>
          <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
            <SwipeableViews
              index={value}
              onChangeIndex={handleChangeIndex}
              className="slider"
            >
              <TabPanel value={value} active="true" index={0}>
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
                    <CircularProgress />
                  </Box>
                ) : (
                  <ListFollowFollowing DetailEx={followerDetailEx} />
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
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
                    <CircularProgress />
                  </Box>
                ) : (
                  <ListFollowFollowing DetailEx={followingDetailEx} />
                )}
              </TabPanel>
            </SwipeableViews>
          </Box>
        </DialogContent>

      </Dialog>
    </>
  );
};

export default ShowFollowFollowing;
