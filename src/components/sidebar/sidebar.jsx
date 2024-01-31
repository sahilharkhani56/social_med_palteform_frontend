import React from "react";
import "./sidebar.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SidebarItems from "./sidebarItems";
import Box from "@mui/material/Box";
import { Link } from "@mui/material";
import Post from "./post";
import { Avatar,Menu,MenuItem } from "@mui/material";
export const Sidebar = ({ defaultActive }) => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [activeIndex, setActiveIndex] = React.useState(defaultActive || 0);
  const navigateTo = useNavigate();
  const handleLinkClick = (route, index) => {
    if(index===4){
      navigateTo(`/${usernameSelector.username}`);
      setActiveIndex(index);
      return;
    }
    navigateTo(route);
    setActiveIndex(index);
  };
  const handleOpenMenuProfile=(event)=>{
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="sidebar">
      <Box className="sidebarRow" onClick={handleOpenMenuProfile}>
        <Avatar src={usernameSelector.profile || ''} />
        <h4>{usernameSelector.username}</h4>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
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
              <h4>{item.name}</h4>
            </Box>
          </Link>
        );
      })}
      <Post/>
    </div>
  );
};
