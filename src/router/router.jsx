import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/login/login";
import Register from "../components/register/register";
import { AuthUser } from "../middleware/authUser";
import Root from "../components/root";
const Router = createBrowserRouter([
  {
    path: "/login",
    element: <SignIn></SignIn>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/",
    element: (
      <AuthUser>
        <Root />
      </AuthUser>
    ),
  },
]);
export default Router;
