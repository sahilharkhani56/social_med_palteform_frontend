import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  Tooltip,
  Box,
  Toolbar,
  TextField,
  InputAdornment,
} from "@mui/material";
import firebase, { auth, db } from "../../setup/firebase.js";
// import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import CloseIcon from "@mui/icons-material/Close";
import "./editProfile.css";
import convertToBase64 from "../../helper/converToBase64";
import toast from "react-hot-toast";
export const EditProfile = ({ userDetail }) => {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(userDetail.profile);
  const handleEdit = async(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const usernameFieldModal = formJson.usernameFieldModal;
    const bioFieldModal = formJson.bioFieldModal;
    console.log(usernameFieldModal,bioFieldModal);
    const docRef = firebase.firestore().collection("users");
    try {
      const snapshot = await docRef.where("username", "==", usernameFieldModal).get();
      if (!snapshot.empty && snapshot.docs[0].id != userDetail.uid) {
        toast.error(`Username ${usernameFieldModal} is not available`);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(`Please try again!`);
      return;
    }
    
    handleOpenEditModalClose();
  };
  const handleOpenEditModalOpen = () => {
    setOpen(true);
  };
  const handleOpenEditModalClose = () => {
    setOpen(false);
  };
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className="btnboth editBtn"
        onClick={handleOpenEditModalOpen}
      >
        Edit Profile
      </Button>
      <Dialog
        open={open}
        onClose={handleOpenEditModalOpen}
        maxWidth="sm"
        fullWidth
        className="dialogModal"
        PaperProps={{
          component: "form",
          onSubmit: handleEdit,
        }}
      >
        <DialogTitle>
          <Stack className="editToolbar" direction="row" spacing={2}>
            <Tooltip
              title="Close"
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
              <IconButton
                className="closeBtn"
                onClick={handleOpenEditModalClose}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography className="editDetailTitle">Edit Profile</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={4}>
            <label htmlFor="profile">
              <Avatar
                src={file || userDetail.profile}
                className="profileImg"
                alt="image"
              ></Avatar>
            </label>
            <input
              type="file"
              id="profile"
              name="profile"
              onChange={onUpload}
              className="inputProfile"
            ></input>
            <TextField
              autoFocus
              required
              margin="dense"
              defaultValue={userDetail.username}
              label="Username"
              id="usernameFieldModal"
              name="usernameFieldModal"
              type="text"
              fullWidth
              variant="standard"
            />
          </Stack>
          <TextField
            autoFocus
            required
            margin="dense"
            defaultValue={userDetail.bio}
            label="Bio"
            id="bioFieldModal"
            name="bioFieldModal"
            type="text"
            fullWidth
            multiline
            variant="standard"
          />
        </DialogContent>
        <DialogActions style={{ position: "relative" }}>
          <Button
            variant="contained"
            color="primary"
            style={{
              borderRadius: "50px",
              margin: "1%",
            }}
            type="submit"
            className="postbtnModal"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};