import * as React from "react";
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
import toast from "react-hot-toast";
import NetworkStatus from "../network/network.jsx";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import Tooltip from "@mui/material/Tooltip";
import './register.css'
import axios from "axios";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {storage } from "../../setup/firebase";
import { v4 as uuidv4 } from 'uuid';
const informationURL = `${import.meta.env.VITE_BACKEND_URI}/api/information`;
export default function Register() {
  const navigateTo=useNavigate();
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [dataImage,setDataImage]=React.useState(null);
  const onUpload=async (event)=>{
    const file = event.target.files[0];
    setSelectedImage(file);
  }
  const handleSubmit = async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const username=data.get("username");
  const email = data.get("email");
  const password = data.get("password");
  if (password === "" || email === "" || username==="") {
    toast.error("Invalid Credentials");
    return;
  }
  const docRef = firebase.firestore().collection("users");
  try {
    const snapshot = await docRef.where("username", "==", username).get();
    if (!snapshot.empty) {
      toast.error(`Username ${username} is not available`);
      return;
    }
  } catch (error) {
    console.log(error.message);
    toast.error(error.message)
    return;
  }
  try {
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    let imageDownloadUrl = null;
    if (selectedImage) {
      try {
        const imageRef = storageRef(storage, `images/${uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        const url = await getDownloadURL(snapshot.ref);
        imageDownloadUrl = url;
      } catch (error) {
        toast.error(error.message)
      }
    }
    await Promise.all([
      imageDownloadUrl && setDataImage(imageDownloadUrl),
      axios.post(informationURL, {
        profile: selectedImage ? imageDownloadUrl : null,
        email,
        username,
        uid:auth.currentUser.uid,
      }),
    ]);
    toast.success("Registered Successfully");
    navigateTo('/');
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <Container component="main" maxWidth="xs">
      <NetworkStatus/>
      <CssBaseline />
      <Box sx={{ display: "flex",flexDirection: "column",alignItems: "center",p: "1.5rem",pt: "1.5rem",pb: "3rem",borderColor: "grey.600",}}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className="infotext">
          Create your account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0.5 }} >
        <label htmlFor="profile" >
        <Tooltip
              title="Upload Profile"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
            >
              <Avatar
                src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
                className="profileImgRegistration"
                alt="image"
                sx={{
                margin: "0 auto",
              }}
              ></Avatar>
              </Tooltip>
            </label>
            <input
              type="file"
              id="profile"
              name="profile"
              onChange={onUpload}
              className="inputProfile"
            ></input>
        <TextField margin="normal" required fullWidth id="username" label="username" name="username" autoComplete="username"/>
          <TextField margin="normal" required fullWidth id="email" label="email" name="email" autoComplete="email"/>
          <TextField  margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password"/>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign up
          </Button>
          <Grid container>
            <Grid item><Typography>{"Already have an account? "} <Link href="/" variant="body2" underline='none' sx={{fontSize:'16px'}}>
                {"Log in"}
                </Link>
             </Typography> 
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
