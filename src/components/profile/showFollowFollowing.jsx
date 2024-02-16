import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tab,
  Tabs,
  AppBar,
  CircularProgress,
  Typography,
} from "@mui/material";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
// import SwipeableViews from "react-swipeable-views";
import "./showFollowFollowing.css";
import ShowList from "./listFollowFollowing.jsx";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
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
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
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
    try {
      const tempInformation = [];
      const informationPromise = information.map(async (id) => {
        const docRefUser = firebase.firestore().collection("users").doc(id);
        const snapshot = await docRefUser.get();
        if (snapshot.exists) {
          const { username, profile, bio } = snapshot.data();
          tempInformation.push({ username, profile, bio });
        }
      });
      await Promise.all(informationPromise);
      if (tp === "follower") {
        setFollowerDetailEx(tempInformation);
      } else {
        setFollowingDetailEx(tempInformation);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const followerDetailDataExtraction = () => {
    setIsLoading(true);
    dataExtraction(followerDetail, "follower");
  };

  const followingDetailDataExtraction = () => {
    setIsLoading(true);
    dataExtraction(followingDetail, "following");
  };
  React.useEffect(() => {
    if (open) {
      if (value === 0) {
        followerDetailDataExtraction();
      } else {
        followingDetailDataExtraction();
      }
    }
  }, [open, value]);
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
        <DialogContent
          style={{ maxHeight: "300px", minHeight: "300px" }}
          className="listFollowFollowing"
        >
          <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
            <CustomTabPanel value={value} index={0}>
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
                <ShowList DetailEx={followerDetailEx} />
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
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
                <ShowList DetailEx={followingDetailEx} />
              )}
            </CustomTabPanel>
            {/* <SwipeableViews
              index={value}
              onChangeIndex={handleChangeIndex}
              className="slider"
            >
              <TabPanel value={value} index={0} >
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
                <ShowList DetailEx={followerDetailEx} />
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
                    <CircularProgress/>
                  </Box>
                ) : (
                <ShowList DetailEx={followingDetailEx} />
                )}
              </TabPanel>
            </SwipeableViews> */}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowFollowFollowing;
