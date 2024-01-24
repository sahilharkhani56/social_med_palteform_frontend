import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import avatar from "../../assets/avatar.jpg";
import convertToBase64 from "../../helper/converToBase64";
import firebase, { auth, db } from "../../setup/firebase.js";
import "firebase/compat/firestore";
import axios from "axios";
import { login } from "../../store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import "./information.css";
import { useNavigate } from "react-router-dom";
const informationURL = `${import.meta.env.VITE_BACKEND_URI}/api/information`;
export default function Information() {
  const dispatch = useDispatch();
  const usernameSelector = useSelector((state) => state.user.user);
  // dispatch(login(email));
  console.log(
    usernameSelector.email,
    usernameSelector.username,
    usernameSelector.profile,
    usernameSelector.isInformationUpdated
  );
  const navigateTo = useNavigate();
  const [Gender, setGender] = React.useState("");
  const [file, setFile] = React.useState(usernameSelector.profile);
  const [open, setOpen] = React.useState(false);
  const [isDateInvalid, setIsDateInvalid] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [usernameInitial, setUsernameInitial] = React.useState(
    usernameSelector.username || ""
  );
  const [date, setDate] = React.useState(null);

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };
  const handleChangeBirthdate = (event) => {
    setDate(event.format());
    // setDate(event.target.value);
  };
  const handleChangeUsername = (event) => {
    setUsernameInitial(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  const { control, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      username: usernameInitial,
      birthdate: new Date(),
      phonenumber: "",
    },
  });
  const { errors } = formState;

  const hSubmit = async (data) => {
    const { gender, phonenumber, birthdate } = data;
    // console.log(data);
    const username = usernameInitial;

    if (!username || !gender || !phonenumber || !birthdate) {
      // console.log(username, gender, phonenumber, birthdate);
      toast.error("Fill All Blanks!");
      return;
    }
    // console.log(username, gender, phonenumber, birthdate);

    const email = currentUser.email;
    const uid = currentUser.uid;
    const docRef = firebase.firestore().collection("users");
    // const UsersCollectionRef = collection(db, "users");
    try {
      const snapshot = await docRef.where("username", "==", username).get();
      // const snapshot = await getDocs(
      //   query(UsersCollectionRef, where("username", "==", username))
      // );
      if (!snapshot.empty && snapshot.docs[0].id != uid) {
        toast.error(`Username ${username} is not available`);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(`Please try again!`);
      return;
    }

    try {
      const addInformation = await axios.post(informationURL, {
        email,
        username,
        birthdate: date,
        phonenumber,
        gender,
        profile: file,
        uid,
      });
      // const docRef=firebase.firestore().collection('users').doc(uid);
      // await docRef.set({
      //   email,
      //   username,
      //   birthdate: date,
      //   phonenumber,
      //   gender,
      //   profile: file ,
      // })
      if(!addInformation.status){
        toast.error(addInformation.data.error);
        return;
      }
      dispatch(
        login({ uid,email, username, profile: file, isInformationUpdated: true })
      );
      toast.success("Upadated sucessfully!");
      navigateTo("/home");
    } catch (error) {
      toast.error(error);
      return;
    }
  };
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
  return (
    <Container component="main" maxWidth="xs" className="mainclass">
      <CssBaseline />
      <FormProvider {...{ control }}>
        <div className="outerbox">
          <div className="innerbox">
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(hSubmit)}
              className="informationform"
            >
              <Typography component="h1" variant="h5" className="infotext">
                Personal Information
              </Typography>
              <div className="profile flex justify-center py-3">
                <label htmlFor="profile">
                  <img
                    src={file || usernameSelector.profile || avatar}
                    className="profile_img"
                    alt="image"
                  ></img>
                </label>
                <input
                  type="file"
                  id="profile"
                  name="profile"
                  onChange={onUpload}
                  className="inputProfile"
                ></input>
              </div>
              <TextField
                sx={{ width: 300 }}
                id="username"
                label={usernameInitial ? "" : "Username"}
                variant="outlined"
                className={`username ${errors.username ? "error" : ""}`}
                value={usernameInitial}
                onChange={handleChangeUsername}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  className="Birthdate"
                >
                  <DatePicker
                    label="Birthdate"
                    sx={{ width: 300 }}
                    name="birthdate"
                    id="date"
                    value={date}
                    onChange={handleChangeBirthdate}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel id="demo-controlled-open-select-label">
                  Gender
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  value={Gender}
                  className="gender"
                  label="Gender"
                  {...control.register("gender")}
                  onChange={handleChangeGender}
                >
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>
              <Controller
                control={control}
                rules={{
                  validate: (value) => true,
                }}
                render={({ field, fieldState }) => (
                  <MuiTelInput
                    {...field}
                    defaultCountry="FR"
                    className="phonenumber"
                    sx={{ minWidth: 300 }}
                    // helperText={fieldState.invalid ? "Invalid Number" : ""}
                    // error={fieldState.invalid}
                  />
                )}
                name="phonenumber"
              />
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  className="submitbtn"
                >
                  Continue
                </Button>
              </Box>
            </form>
          </div>
        </div>
      </FormProvider>
    </Container>
  );
}
