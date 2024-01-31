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
import axios from "axios";
import "firebase/compat/firestore";
import CloseIcon from "@mui/icons-material/Close";
import "./editProfile.css";
import convertToBase64 from "../../helper/converToBase64";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice.js";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {storage } from "../../setup/firebase";
import { v4 as uuidv4 } from 'uuid';
const editInformationUrl = `${
  import.meta.env.VITE_BACKEND_URI
}/api/editInformation`;
export const EditProfile = ({ userDetail }) => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [dataImage, setDataImage] = React.useState(null);
  const handleEdit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const usernameFieldModal = formJson.usernameFieldModal;
    const bioFieldModal = formJson.bioFieldModal;
    const docRef = firebase.firestore().collection("users");
    try {
      const snapshot = await docRef
        .where("username", "==", usernameFieldModal)
        .get();
      if (!snapshot.empty && snapshot.docs[0].id != userDetail.uid) {
        toast.error(`Username ${usernameFieldModal} is not available`);
        return;
      }
      let imageDownloadUrl = null;
      if (file) {
        try {
          const imageRef = storageRef(storage, `images/${uuidv4()}`);
          const snapshot = await uploadBytes(imageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          imageDownloadUrl = url;
        } catch (error) {
          toast.error(error.message)
          console.error("Error uploading image:", error);
        }
      }
      await Promise.all([
        imageDownloadUrl && setDataImage(imageDownloadUrl),
        axios.post(editInformationUrl, {
          profile: file ? imageDownloadUrl :userDetail.profile,
          username: usernameFieldModal,
          uid: userDetail.uid,
          bio: bioFieldModal,
        }),
      ]);
      // await axios.post(editInformationUrl, {
      //   username: usernameFieldModal,
      //   profile: file || userDetail.profile,
      //   uid: userDetail.uid,
      //   bio: bioFieldModal,
      // });
      dispatch(
        login({
          uid: userDetail.uid,
          email: userDetail.email,
          username: usernameFieldModal,
          profile:  file ? imageDownloadUrl :userDetail.profile,
        })
      );
      navigateTo(`/${usernameFieldModal}`, { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
    setFile(e.target.files[0]);
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
        onClose={handleOpenEditModalClose}
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
                src={file ? URL.createObjectURL(file) : userDetail.profile}
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
              style={{display:'none'}}
            ></input>
            <TextField
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
