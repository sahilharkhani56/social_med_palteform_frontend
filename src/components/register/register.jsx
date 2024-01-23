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
import { auth,db } from "../../setup/firebase.js";
export default function Register() {
  const navigateTo=useNavigate();
  const handleSubmit = async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const email = data.get("email");
  const password = data.get("password");
  if (password === "" || email === "") {
    toast.error("Invalid Credentials");
    return;
  } 
  try {
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.success("Registered Successfully");
    navigateTo('/');
  } catch (error) {
    toast.error(error);
  }
};

  return (
    <Container component="main" maxWidth="xs">
      <NetworkStatus/>
      <CssBaseline />
      <Box sx={{ marginTop: 5,display: "flex",flexDirection: "column",alignItems: "center",p: "1.5rem",pt: "2rem",pb: "3rem",borderColor: "grey.600",}}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className="infotext">
          Create your account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0.5 }}>
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
