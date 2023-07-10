import { ManageAccountsOutlined,EditAttributesOutlined,LocationOnOutlined,WorkOutlineOutlined } from "@mui/icons-material";
import { Box,Typography,useTheme,Divider} from "@mui/material";
import userImage from "components/userImage";
import FlexBetween from "components/Flexbetween";
import widgetWrapper from "components/widgetWrapper";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const userWidget=({userId,picturePath})=>{
    const [user,setUser]=useState(null);
    const {palette}=useTheme();
    const navigate=useNavigate();
    const token =useSelector((state)=>{
        state.token
    })
    const dark=palette.neutral.dark;
    const medium=palette.neutral.medium;
    const main=palettte.neutral.main;

    const getUser=async()=>{
        const response=fetch(`http://localhost:3001/users/${userId}`,{
            method:"GET",
            headers:{Authorization:`Bearer:${token}`}
        })
        const data=await response.json();
        setUser(data);
    };
    useEffect(()=>{
        getUser();
    },[])
    if(!user){
        return null
    };
    const {
        firstname,
        lastname,
        location,
        occupation,
        viewedprofile,
        impressions,
        friends
    }=user;
return(
    <widgetWrapper>
        <FlexBetween gap={"0.5rem"} pb={"1.1rem"} onClick={()=>{navigate(`profilepage`)}}>
         <FlexBetween>
            <userImage image={picturePath}/>
            <Box>
                <Typography variant="h4" color={dark} fontWeight="500"  sx={{
                    "$ :hover":
                    {color:palette.primary.light,
                     cursor:"pointer"
                    }}}>
                    {firstname} {lastname}
                </Typography>
                <Typography color="medium">
                    {friends.length} friends
                </Typography>
            </Box>
            <ManageAccountsOutlined/>
         </FlexBetween>
         <Divider/>
         {/**second Row */}

    <Box p={"1rem 0"}>
        <Box display={"flex"} alignItems={"center"} gap={"1rem"} mb="0.5rem">
          <LocationOnOutlined fontSize="large" color={main}></LocationOnOutlined>
          <Typography color={medium}>{location}</Typography>
         </Box>
         <Box display={"flex"} alignItems={"center"} gap={"1rem"} >
          <WorkOutlineOutlined fontSize="large" color={main}/>
          <Typography color={medium}>{occupation}</Typography>
        </Box>
    </Box>

        </FlexBetween>
    </widgetWrapper>
)
}
