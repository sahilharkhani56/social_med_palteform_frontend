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
import avatar from '../../assets/avatar.jpg';

const Post = () => {
  const usernameSelector = useSelector((state) => state.user.user);
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const handlePost = (event) => {
    event.preventDefault();
    console.log(selectedImage);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const inputFieldModal = formJson.inputFieldModal;
    console.log(inputFieldModal);
    handleOpenPostModalClose();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleOpenPostModalOpen = () => {
    setOpen(true);
  };
  const handleOpenPostModalClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  const handleImageRemove = () => {
    setSelectedImage(null);
  };
  return (
    <div>
      <Button id="tweet" onClick={handleOpenPostModalOpen} >
        POST
      </Button>
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
        <DialogTitle>
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
                src={usernameSelector.profile || avatar}
                className="userModalProfile"
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
