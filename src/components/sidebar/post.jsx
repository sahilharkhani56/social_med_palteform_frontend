import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import PhotoIcon from "@mui/icons-material/Photo";
import TextField from "@mui/material/TextField";
import { Button, Link } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../setup/firebase";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import toast from "react-hot-toast";
const postUrl=`${import.meta.env.VITE_BACKEND_URI}/api/post`;

const Post = ({ open, handleOpenPostModalClose }) => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [dataImage,setDataImage]=React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handlePost = async(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const inputFieldModal = formJson.inputFieldModal;
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
  
    try {
      await Promise.all([
        imageDownloadUrl && setDataImage(imageDownloadUrl),
        axios.post(postUrl, {
          image: selectedImage ? imageDownloadUrl : null,
          text: inputFieldModal,
          createdBy: usernameSelector.uid,
        }),
      ]);
      handleOpenPostModalClose();
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleOpenPostModalClose}
        maxWidth="sm"
        fullWidth
        className="dialogModal"
        PaperProps={{
          component: "form",
          onSubmit: handlePost,
        }}
      >
        <DialogTitle sx={{padding:'16px 16px'}}>
          <div className="post-header">
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
                className="close-btn"
                onClick={handleOpenPostModalClose}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Box
              className="userModal"
              style={{ display: "flex", marginTop: "2%" }}
            >
              <Avatar
                src={usernameSelector.profile }
              />
              <h4 className="userModalUsername" style={{ marginLeft: "10px" }}>
                {usernameSelector.username}
              </h4>
            </Box>
          </div>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="inputFieldModal"
            name="inputFieldModal"
            placeholder="What's happening?"
            type="text"
            fullWidth
            multiline
            variant="standard"
            InputProps={{ disableUnderline: true }}
          />
          {selectedImage ? (
            <div
              className="selectedImageParent"
              style={{ position: "relative", width: "100%", marginTop: "16px" }}
            >
              <Tooltip
                title="Remove"
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
                  aria-label="delete"
                  style={{
                    position: "absolute",
                    right: "2%",
                    top: "2%",
                    backgroundColor: "#A9A9A9",
                    color: "white",
                    cursor: "visible",
                  }}
                  onClick={handleImageRemove}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <img
                className="selectedImage"
                src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
                style={{
                  borderRadius: "10px",
                  width: "100%",
                  maxHeight: "500px",
                }}
                alt=""
              />
            </div>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions style={{ position: "relative" }}>
          <InputAdornment
            position="end"
            style={{ position: "absolute", left: "1%" }}
          >
            <input
              type="file"
              accept="image/*"
              id="image-input"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="image-input">
              <Tooltip
                title="Media"
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
                <IconButton component="span" className="photo-btn">
                  <PhotoIcon />
                </IconButton>
              </Tooltip>
            </label>
          </InputAdornment>
          <Button
            variant="contained"
            color="primary"
            style={{
              borderRadius: "50px",
              margin: "2%",
            }}
            type="submit"
            className="postbtnModal"
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Post;
