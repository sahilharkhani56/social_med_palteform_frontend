import React from "react";
import "./sidebar.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SidebarItems from "./sidebarItems";
import Box from "@mui/material/Box";
import avatar from "../../assets/avatar.jpg";
import {Link } from "@mui/material";
import Post from "./post";
import { Avatar } from "@mui/material";
export const Sidebar = ({ defaultActive }) => {
  const usernameSelector = useSelector((state) => state.user.user);
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

  return (
    <div className="sidebar">
      <Box className="sidebarRow">
        <Avatar src={usernameSelector.profile || ''} />
        <h4>{usernameSelector.username}</h4>
      </Box>
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
