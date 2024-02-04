import * as React from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import toast, { Toaster } from "react-hot-toast";
import NetworkStatus from "../network/network.jsx";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import firebase, {
  googleAuthProvider,
  auth,
  db,
} from "../../setup/firebase.js";
import { GoogleButton } from "react-google-button";
import { login } from "../../store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
const informationURL = `${import.meta.env.VITE_BACKEND_URI}/api/information`;
export default function SignIn() {
  const dispatch = useDispatch();
  const usernameSelector = useSelector((state) => state.user.user);
  const navigateTo = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get("email");
    var password = data.get("password");
    // email='1@gmail.com';
    // password='123@123';
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const docRef = firebase.firestore().collection("users").doc(auth.currentUser.uid);
          const userDataSnapShot = await docRef.get();
            const userData = userDataSnapShot.data();
            dispatch(
              login({
                uid:auth.currentUser.uid,
                email: email,
                username: userData.username,
                profile: userData.profile,
              })
            );
          toast.success("Login Successfully");
          navigateTo("/home");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } catch (error) {
      toast.error(error.message)
    }
  };
  const logGoogleUser = async () => {
    await signInWithPopup(auth, googleAuthProvider);
    try {
      const docRef = firebase.firestore().collection("users").doc(auth.currentUser.uid);
      const userDataSnapShot = await docRef.get();
      if (userDataSnapShot.exists) {
        const userData = userDataSnapShot.data();
        dispatch(
          login({
            uid:auth.currentUser.uid,
            email: userData.email,
            username: userData.username,
            profile: userData.profile,
          })
        );
      } else {
        await axios.post(informationURL, {
          email: auth.currentUser.email,
          username: auth.currentUser.displayName,
          profile: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
        });
        dispatch(
          login({
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            username: auth.currentUser.displayName,
            profile: auth.currentUser.photoURL,
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    toast.success("Login Successfully");
    navigateTo("/home ");
  };

  return (
    <Container component="main" maxWidth="xs">
      <NetworkStatus />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "1.5rem",
          pt: "2rem",
          pb: "3rem",
          borderColor: "grey.600",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className="infotext">
          Welcome Back!
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, mb: 3 }}
          className="emailauthclass"
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            className="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            className="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="submitbtn"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Typography>
                {"Don't have an account? "}
                <Link
                  href="/register"
                  variant="body2"
                  underline="none"
                  sx={{ fontSize: "16px" }}
                >
                  {"Sign up"}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <GoogleButton onClick={logGoogleUser} className="googlebtn">
          Sign In With Google
        </GoogleButton>
      </Box>
    </Container>
  );
}
