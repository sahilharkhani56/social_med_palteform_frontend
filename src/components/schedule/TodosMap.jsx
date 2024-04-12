import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Item, darkTheme, lightTheme, ThemeProvider } from './styleMUI.js';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { Create } from '@mui/icons-material';
export default function TodosMap({
  list,
  editBtn,
  dell,
  chek,
  setBolean,
  check,
  add,
}) {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      width="auto"
      /* backgroundColor= "black" */
    >
      <Grid item xs={6}>
        <ThemeProvider theme={lightTheme}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              display: 'table-row-group',
            }}
          >
            {list.map((item) => (
              <Item className="individualBox" key={item.id} elevation={12}>
                <Checkbox
                  checked={item.tc ? true : false}
                  onClick={(e) => chek(item.id, !item.tc, item.todo)}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                />

                <span className="lead">
                  {item.tc ? <s> {item.todo}</s> : item.todo}
                </span>
                {'       '}
                <IconButton onClick={(e) => dell(item.id)} className="btn btn-danger btn-sm float-end mt-3 mx-2" >
                    <DeleteOutlineIcon/>
                </IconButton>
                <IconButton  variant="contained"
                  size="small"
                  className="btn btn-warning btn-sm  float-end pl-5  mt-3"
                  onClick={(e) => editBtn(item)}>
                    <Create/>
                  </IconButton>

                {/* <Button
                  onClick={(e) => dell(item.id)}
                  className="btn btn-danger btn-sm float-end mt-3 mx-2"
                >
                  ✘-Dell
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  className="btn btn-warning btn-sm  float-end pl-5  mt-3"
                  onClick={(e) => editBtn(item)}
                >
                  ✎-edit
                </Button> */}

              </Item>
            ))}
          </Box>
        </ThemeProvider>
      </Grid>
    </Grid>
  );
}
