import React from 'react'
import { useDispatch,useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export const AuthInformation=({children})=>{
    const usernameSelector=useSelector((state)=>state.user.user);
    if(usernameSelector.isInformationUpdated){
        return <Navigate to={'/home'} replace={true}></Navigate>
    }
    return children;
}