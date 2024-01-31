import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "../components/login/login";
import Register from "../components/register/register";
import Home from "../components/home/home";
import Message from "../components/message/message";
import Connection from "../components/connection/connection";
import Profile from "../components/profile/profile";
import Bookmark from "../components/bookmark/bookmark";
import Setting from "../components/setting/setting";
import { AuthUser, UserExits } from "../middleware/authUser";
import { lazy, Suspense } from "react";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn></SignIn>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  // {
  //   path:'/information',
  //   element:<AuthUser><Information/></AuthUser>
  // },
  {
    path: "/home",
    element: (
      <AuthUser>
        <Home />
      </AuthUser>
    ),
  },
  {
    path: "/messages",
    element: <Message />,
  },
  {
    path: "/connections",
    element: <Connection />,
  },
  {
    path: "/bookmarks",
    element: <Bookmark />,
  },
  {
    path: "/:profileName",
    element: (
      <UserExits>
        <Profile />
      </UserExits>
    ),
  },
  {
    path: "/setting",
    element: <Setting />,
  },
  {
    path: "*",
    element: <SignIn></SignIn>,
  },
]);
export default Router;
