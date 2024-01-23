import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "../components/login/login";
import Register from "../components/register/register";
import Information from "../components/information/information";
import Home from "../components/home/home";
import Message from "../components/message/message";
import Connection from "../components/connection/connection";
import Profile from "../components/profile/profile";
import Bookmark from "../components/bookmark/bookmark";
import Setting from "../components/setting/setting";
import { AuthInformation } from "../middleware/authInformation";
import { AuthUser } from "../middleware/authUser";
const Router = createBrowserRouter([
  {
    path: "/",
    element:<SignIn></SignIn>,
  },
  {
    path:'/register',
    element:<Register></Register>
  },
  {
    path:'/information',
    element:<AuthInformation><AuthUser><Information/></AuthUser></AuthInformation>
  },
  {
    path:'/home',
    element:<AuthUser><Home/></AuthUser>
  },
  {
    path:'/messages',
    element:<Message/>
  },
  {
    path:'/connections',
    element:<Connection/>
  },
  {
    path:'/bookmarks',
    element:<Bookmark/>
  },
  {
    path:'/:profileName',
    element:<Profile/>
  },
  {
    path:'/setting',
    element:<Setting/>
  }
]);
export default Router;
