import Grid from "@mui/material/Grid";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { AppBar, Box, TextField, Toolbar } from "@mui/material";
import firebase, { auth, db } from "../../setup/firebase.js";
import IconButton from "@mui/material/IconButton";
import "firebase/compat/firestore";
import { useSelector } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddTaskIcon from '@mui/icons-material/AddTask';
import AddIcon from '@mui/icons-material/Add';
import { Search, SearchIconWrapper, StyledInputBase } from './styleMUI.js';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import uniqid from 'uniqid';
import TodosMap from './TodosMap.jsx';

const KEY = 'todoApp.todos';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import './schedule.css'
export function NavBar({ add, todo, input, bolean, setBtnToEdit }) {
    return (
      <>
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <AppBar position="static" sx={{justifyContent:'center',display:'flex'}}>
            <Toolbar>
              {/* <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block', mr: 2 } }}
              >
                To-do List
              </Typography> */}
              <Search>
                <SearchIconWrapper>
                  <FormatListBulletedIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={(e) => input(e.target.value)}
                  placeholder="New Task"
                  inputProps={{ 'aria-label': 'search' }}
                  value={todo}
                />
              </Search>
  
              <IconButton
                //type="submit"
                onClick={bolean ? setBtnToEdit : add}
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                /* sx={{ m: 'auto' }} */
              >
                {bolean ? <EditAttributesIcon fontSize="medium" /> : <AddIcon />}
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
      </>
    );
  }
const Schedule = () => {
    const usernameSelector = useSelector((state) => state.user.user);
  

    const [todo, setTodo] = React.useState('');
  const [todoList, setTodoList] = React.useState([]);
  const [boleanTodo, setBoleanTodo] = React.useState(false);
  const [todoId, setTodoId] = React.useState('');

  React.useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(KEY));
    if (storedTodos) {
      setTodoList(storedTodos);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(todoList));
  }, [todoList]);

  const addTodo = (e) => {
    console.log(todoList);
    e.preventDefault();
    if (todo === '') {
      return;
    }
    setTodoList([...todoList, { id: uniqid(), todo, tc: false }]);
    setTodo('');
  };

  const dellTodo = (id) => {
    const newTodos = todoList.filter((item) => item.id !== id);

    setTodoList(newTodos);
  };

  const btnEditTodo = (item) => {
    setBoleanTodo(true);
    setTodoId(item.id);

    setTodo(item.todo);
  };

  const editTodo = (e) => {
    e.preventDefault();

    if (todo === '') {
      return;
    }

    const newTodos = todoList.map((item) =>
      item.id === todoId ? { id: uniqid(), todo, tc: false } : item
    );

    setTodoList(newTodos);
    setBoleanTodo(false);
    setTodoId('');
    setTodo('');
  };

  const cheked = (id, tc, todo) => {
    console.log(id, tc, todo);

    const newTodos = todoList.map((item) =>
      item.id === id ? { id: uniqid(), todo, tc } : item
    );
    setTodoList(newTodos);
  };

    return (
        <div className="grid-container">
          <Grid container>
            <Grid
              item
              xs={12}
              style={{ overflow: "auto", height: "100vh" }}
              className="msgPortion"
            >
              <AppBar
                component="nav"
                position="sticky"
                className="searchBarMsg"
                elevation={0}
              >
                <Toolbar variant="dense">
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    // onClick={() => navigateTo('/messages')}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Typography
                    variant="h6"
                    color="inherit"
                    component="div"
                    className="appBarUsername"
                  >
                    Add Schedule
                  </Typography>
                  
                </Toolbar>
              </AppBar>
              {/* <Box className="searchFriendMsg">
              <TextField
                    placeholder="Add Task"
                    className="scheduleInput"
                    autoComplete="off"
                    sx={{ outline: 0, "& fieldset": { border: "none" }, p: 0 }}
                    inputProps={{ style: { fontSize: 16 } }}
                    InputLabelProps={{ style: { fontSize: 16 } }}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    value={currentInput}
                  ></TextField>
                  {currentInput.length > 0 ? (
                    <IconButton
                      className="sendBtn"
                      onClick={addSchedule}
                    >
                      <AddTaskIcon  sx={{ fontSize: 34 }}></AddTaskIcon>
                    </IconButton>
                  ) : (
                    <IconButton className="sendBtn" disabled>
                      <AddTaskIcon  sx={{ fontSize: 34 }}></AddTaskIcon>
                    </IconButton>
                  )}
                </Box>
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                
              </List> */}
              <React.Fragment>
      <NavBar
        add={addTodo}
        todo={todo} // setTodo
        input={setTodo}
        bolean={boleanTodo}
        setBtnToEdit={editTodo}
      />
      {todoList.length ? (
        <p className="completed">
          You have {todoList.filter((todo) => !todo.tc).length} tasks to
          complete!
        </p>
      ) : null}
      <TodosMap
        list={todoList}
        editBtn={btnEditTodo}
        dell={dellTodo}
        chek={cheked}
      />
    </React.Fragment>
            </Grid>
          </Grid>
        </div>
      );
}

export default Schedule