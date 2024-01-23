import React from 'react'
import { Sidebar } from '../sidebar/sidebar'
import Grid from '@mui/material/Grid';

const Setting = () => {
  return (
    <div className="grid-container"> 
    <Grid container spacing={3}>
      <Grid item xs='auto'>
        <Sidebar defaultActive={5}/>
      </Grid>
      <Grid item xs={8} lg={6}>
        <p>setting</p>
      </Grid>
      {/* <Grid item xs display={{ xs: "none", lg: "block" }}>
        <Rightbar />
      </Grid> */}
    </Grid>
    </div>
  )
}

export default Setting