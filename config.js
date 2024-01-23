
const firebaseConfig = {
    apiKey: "AIzaSyDg_EPyCXxM4JREunE2ZPIYoh8bT2gTEEw",
    authDomain: "clickcreate-7de20.firebaseapp.com",
    projectId: "clickcreate-7de20",
    storageBucket: "clickcreate-7de20.appspot.com",
    messagingSenderId: "524701145017",
    appId: "1:524701145017:web:0fbc0b20908725f6fb8868",
    measurementId: "G-TVHW9T815K"
  };
export default{
    LOGIN_URL:`${import.meta.env.VITE_BACKEND_URI}/api/login`,
    REGISTER_URL:`${import.meta.env.VITE_BACKEND_URI}/api/register`,
    INFORMATION_URL:`${import.meta.env.VITE_BACKEND_URI}/api/information`,
    FINDUSERNAME_URL:`${import.meta.env.VITE_BACKEND_URI}/api/findusername`,
    firebaseConfig
}