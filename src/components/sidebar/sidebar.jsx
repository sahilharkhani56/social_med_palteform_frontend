import React from "react";
import "./sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SidebarItems from "./sidebarItems";
import Box from "@mui/material/Box";
import { Button, Link } from "@mui/material";
import Post from "./post";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { logout } from "../../store/userSlice";
export const Sidebar = ({ defaultActive }) => {
  const dispatch = useDispatch();
  const usernameSelector = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPost, setOpenPost] = React.useState(false);
  const { profileName } = useParams();
  const open = Boolean(anchorEl);
  const [activeIndex, setActiveIndex] = React.useState(
    JSON.parse(localStorage.getItem("index"))
  );
  const navigateTo = useNavigate();
  const handleLinkClick = (route, index) => {
    if (index === 3) {
      localStorage.setItem("index", index);
      setActiveIndex(index);
      navigateTo(`/${usernameSelector?.username}`);
      return;
    }
    navigateTo(route);
    setActiveIndex(index);
    localStorage.setItem("index", index);
  };
  const handleOpenMenuProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {};
  const signOutAuth = () => {
    setAnchorEl(null);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logout());
        navigateTo('/login')
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const handleOpenPostModalOpen = () => {
    setOpenPost(true);
  };
  const handleOpenPostModalClose = () => {
    setOpenPost(false);
  };
  return (
    <div className="sidebar">
      <Box className="sidebarRow" onClick={handleOpenMenuProfile}>
        <Avatar src={usernameSelector?.profile || ""} />
        <h4>{usernameSelector?.username}</h4>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Add Existing account</MenuItem>
        <MenuItem onClick={signOutAuth}>Logout</MenuItem>
      </Menu>
      {SidebarItems.map((item, index) => {
        return (
          <Link
            to={item.route}
            style={{ textDecoration: "none" }}
            key={item.name}
          >
            <Box
              className="sidebarRow"
              key={item.name}
              active={(index === activeIndex).toString()}
              onClick={() => handleLinkClick(item.route, index)}
            >
              {index === activeIndex ? <item.filled /> : <item.outlined />}
              <h4 className={index === activeIndex ? "current" : "allItems"}>
                {item.name}
              </h4>
            </Box>
          </Link>
        );
      })}
      <Button id="tweet" onClick={handleOpenPostModalOpen}>
        POST
      </Button>
      {openPost ? (
        <Post
          open={openPost}
          handleOpenPostModalClose={handleOpenPostModalClose}
        />
      ) : null}
    </div>
  );
};
