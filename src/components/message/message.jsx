import React from 'react'
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

const Message = () => {

  return (
    <div className="grid-container"> 
    <Grid container >
      <Grid item xs={12} style={{ overflow: "auto", height: "100vh" }}>
        {/* url(https://www.gstatic.com/dynamite/images/cr/empty_invited_members.svg) */}
        <center
                  style={{
                    display:'flex',
                    height: "100%",
                    flexDirection: "column",
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >
                  <img
                    src={`https://www.gstatic.com/dynamite/images/cr/empty_invited_members.svg`}
                    height={'300px'}
                    alt=""
                    loading="lazy"
                  />
                  <div>
                    <Typography variant="h7">UNDER CONSTRUCTION</Typography>
                  </div>
                </center>
      </Grid>
    </Grid>
    </div>
  )
}

export default Message