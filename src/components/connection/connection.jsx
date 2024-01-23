import React from "react";
import { Sidebar } from "../sidebar/sidebar";
import Grid from "@mui/material/Grid";
import { TextField, Typography } from "@mui/material";
import "./connection.css";
import axios from "axios";
import avatar from '../../assets/avatar.jpg';
import {Box,Avatar }from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const urlAllResult = `${import.meta.env.VITE_BACKEND_URI}/api/allUsers`;
const Connection = () => {
  const navigateTo=useNavigate();
  const usernameSelector = useSelector((state) => state.user.user);
  const [searchData, setSearchData] = React.useState([]);
  const [check, setCheck] = React.useState(false);
  const fetchInfo = async () => {
    const contects = await axios.get(`${urlAllResult}/${usernameSelector.uid}`);
    setSearchData(contects.data);
  };
  React.useEffect(() => {
    fetchInfo();
  }, [check]);
  var itemList = [];
  searchData.map((dataObj, index) => {
    itemList.push(dataObj);
  });
  const [filteredList, setFilteredList] = new React.useState(itemList);
  const handleChangeSearchField = (event) => {
    setCheck(true);
    const query = event.target.value;
    var updatedList = [...itemList];
    updatedList = updatedList.filter((item) => {
      return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    setFilteredList(updatedList);
  };
  const handleOpenProfile=(data,index)=>{
    navigateTo(`/${data.username}`);
  }
  return (
    <div className="grid-container">
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <Sidebar defaultActive={2} />
        </Grid>
        <Grid item xs={8} lg={6} className="connections">
          <Typography className="searchTitle">Search</Typography>
          <div>
            <TextField
              id="filled-search"
              label="Search field"
              type="search"
              variant="filled"
              className="searchField"
              autoComplete='off'
              onChange={handleChangeSearchField}
            />
            {filteredList.map((data,index)=>{
              return ( <Box className="searchList" key={index} onClick={()=>handleOpenProfile(data,index)}>
              <Avatar src={data.profile || avatar} />
              <h4>{data.username}</h4>
            </Box>)
            })}
           
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Connection;
