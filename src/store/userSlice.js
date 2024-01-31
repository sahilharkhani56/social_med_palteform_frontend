import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    user: {
      uid:null,
      email: null,
      username: null,
      profile: null,
    },
  };
  
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
       login: (state, action) => { 
           state.user = action.payload;
       }, 
       logout: (state) => {
           state.user = null;
       },   
    },
});
    
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;