import { useState } from "react";
import {Box,IconButton,InputBase,Typography,Select,MenuItem,FormControl,useTheme,useMediaQuery} from "@mui/material";
import {Search,LightMode,DarkMode,Notifications,Help,Menu,Close,Message} from "@mui/icons-material";
import FlexBetween from "components/Flexbetween";
import { useDispatch,useSelector } from "react-redux";
import { setMode,setLogout } from "state";
import { useNavigate } from "react-router-dom";
const NavPage=()=>{
    const [isMobileMenuToggled,setIsMenuToggled]=useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const theme=useTheme();
    const neutralTheme=theme.palette.neutral.light;
    const dark=theme.palette.neutral.dark;
    const background=theme.palette.background.default;
    const primaryLight=theme.palette.primary.light;
    const alt=theme.palette.primary.alt;
    const user=useSelector((state)=>{state.user});
    const fullname=`${user.firstname} ${user.lastname}`
    const isNonMobileScreen=useMediaQuery("(min-width:1000px)")
    return <FlexBetween padding="1rem 6%" background-color={alt}>
        <FlexBetween gap="1.7rem">
        <Typography fontWeight={"bold"}
         fontSize={"clamp(1rem,2rem,2.5rem)"}
         color={"primary"}  
         onClick={()=>{navigate("/home")}}
        sx={
            {
                "&hover":{
                    color:primaryLight,
                    cursor:"pointer"
                }
            }
        }>

        </Typography>
        {isNonMobileScreen && (<FlexBetween background-color={neutralTheme} borderRadius={"9px"} gap={"3rem"} padding={"0.1rem 1.5rem"}>
        <InputBase placeholder="...search"/>
        <IconButton>
            <Search></Search>
        </IconButton>
        </FlexBetween>)}
        {isNonMobileScreen?
       (
        <FlexBetween gap={"2rem"}>
        <IconButton onClick={()=>{dispatch(setMode())}}>
            {theme.palette.mode===dark?
            <DarkMode sx={{fontSize:"25px"}}></DarkMode>:<LightMode sx={{color:dark, fontSize:"25px"}}></LightMode>}
        </IconButton>
        <Message sx={{fontSize:"25px"}}/>
        <Notifications sx={{fontSize:"25px"}} />
        <Help sx={{fontSize:"25px"}} />
        <FormControl variant="standard" value={fullname}>
            <Select
            value={fullname} sx={{backgroundColor:neutralTheme,
            width:"150px",
            borderRadius:"o.25rem",
            p:".25rem 1rem",
            "& .MuiSvgIcon-root":{
                pr:"0.25rem",
                width:"3rem"
            },
            "& .MuiSelect-select:focus":{
                backgroundColor:neutralTheme
            }
            }}
            input={<InputBase/>}
            >
          <MenuItem value={fullname}>
            <Typography value={fullname}> {fullname}</Typography>
            <MenuItem onClick={()=>{dispatch(setLogout())}}> Logout</MenuItem>
          </MenuItem>
            </Select>
        </FormControl>
        </FlexBetween>
       ) : (
            <IconButton onClick={()=>{setIsMenuToggled(!isMobileMenuToggled)}}>
                <Menu/>
            </IconButton>
            )}
            {!isMobileMenuToggled && !isNonMobileScreen && (<Box
            position="fixed" bottom="0" right="0" height="100%" zIndex="10" maxWidth="500px" backgroundColor={background} minWidth="100px"> 
            <Box display={"flex"} justifyContent="flex-end" p="1rem">
              <IconButton
              onClick={()=>{setIsMenuToggled(!isMobileMenuToggled)}}
              >
                <Close/>
              </IconButton>
            </Box>


            <FlexBetween display={"flex"} justifyContent={'center'} alignItems={"center"} flexDirection={"column"}  gap={"3rem"}>
        <IconButton onClick={()=>{dispatch(setMode())}}>
            {theme.palette.mode===dark?
            <DarkMode sx={{fontSize:"25px"}}></DarkMode>:<LightMode sx={{color:dark, fontSize:"25px"}}></LightMode>}
        </IconButton>
        <Message sx={{fontSize:"25px"}}/>
        <Notifications sx={{fontSize:"25px"}} />
        <Help sx={{fontSize:"25px"}} />
        <FormControl variant="standard" value={fullname}>
            <Select
            value={fullname} sx={{backgroundColor:neutralTheme,
            width:"150px",
            borderRadius:"o.25rem",
            p:".25rem 1rem",
            "& .MuiSvgIcon-root":{
                pr:"0.25rem",
                width:"3rem"
            },
            "& .MuiSelect-select:focus":{
                backgroundColor:neutralTheme
            }
            }}
            input={<InputBase/>}
            >
          <MenuItem value={fullname}>
            <Typography value={fullname}> {fullname}</Typography>
            <MenuItem onClick={()=>{dispatch(setLogout())}}> Logout</MenuItem>
          </MenuItem>
            </Select>
        </FormControl>
        </FlexBetween>
        </Box>)}
        </FlexBetween>
    </FlexBetween>
}
export default NavPage;