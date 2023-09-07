import { Box } from "@mui/material";
import {useMediaQuery} from "@mui/material";
import { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NavPage from "scenes/navbarPage";
import FriendListWidget from "widgets/FriendListWidget";
import PostsWidget from "widgets/PostsWidget";
import UserWidgets from "widgets/UserWidgets";
import config from '../../config';
const ProfilePage=()=>{
    const [user,setUser]=useState(null)
    const {userId}=useParams();
    const token=useSelector((state)=>state.token);
    const isNonMobileScreen=useMediaQuery("(min-width:1000px)")
    const getUser=async()=>{
        const response=await fetch(`${config.API_SERVER}/users/${userId}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        const data=await response.json();
        setUser(data)
    }
    useEffect(()=>{getUser()},[])//eslint-disable-line react-hooks/exhaustive-deps
    if(!user)return null;
    return  <Box>
    <NavPage/>
        <Box
    width="100%"
    padding="2rem 6%"
    display={isNonMobileScreen ? "flex" : "block"}
    gap="2rem"
    justifyContent="center"
  >
    <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
      <UserWidgets userId={userId} picturePath={user.picture}></UserWidgets>
      <Box m={"2rem 0"}/>
      <FriendListWidget userId={userId}></FriendListWidget>
    </Box>
    <Box
      flexBasis={isNonMobileScreen ? "42%" : undefined}
      mt={isNonMobileScreen ? undefined : "2rem"}
    >
      <PostsWidget userId={userId} isProfile={true} />
    </Box>
  
  </Box>
  
    </Box> 
}
export default ProfilePage;