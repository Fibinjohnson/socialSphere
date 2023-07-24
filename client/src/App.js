import {BrowserRouter,Navigate,Routes,Route} from "react-router-dom"
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import ChatWidget from "components/ChatWidget";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline,ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {themeSettings} from "./themes"
import ChatPage from "scenes/chatPage/ChatPage";

function App() {
  const mode=useSelector((state)=>state.mode)
  console.log(mode,":mode")
  const theme=useMemo(()=>createTheme(themeSettings(mode)),[mode])
  const isAuth=Boolean(useSelector((state)=>state.token))  

  return (
    <div className="App">
    <ThemeProvider theme={theme}>
    <CssBaseline/>
      <BrowserRouter>
        <Routes>
         <Route path="/" element={<LoginPage/>}/>
         <Route path="/home" element={isAuth ?<HomePage/>:<Navigate to={"/"}/>}/>
         <Route path="/profile/:userId" element={isAuth ?<ProfilePage/>:<Navigate to={"/"}/>}/>
         <Route path="/home/chat" element={isAuth?<ChatPage/>:<Navigate to={"/"}/>} />
        
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
