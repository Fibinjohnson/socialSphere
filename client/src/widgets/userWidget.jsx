import { ManageAccountsOutlined,LocationOnOutlined,WorkOutlineOutlined, EditOffOutlined } from "@mui/icons-material";
import { Box,Typography,useTheme,Divider} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/Flexbetween";
import SugggestedFriends from "components/SugggestedFriends";
import WidgetWrap from "components/WidgetWrap";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget=({userId})=>{
    const [user,setUser]=useState(null);
    const {palette}=useTheme();
    const navigate=useNavigate();
    const token =useSelector((state)=>
        state.token
    )
    console.log(user,'require user')
    const dark=palette.neutral.dark;
    const medium=palette.neutral.medium;
    const main=palette.neutral.main;

    const getUser=async()=>{
        try{
            const userResponse=await fetch(`http://localhost:3001/users/${userId}`,{
                method:"GET",
                headers:{Authorization:`Bearer ${token}`}
            })
            const data=await userResponse.json();
            setUser(data);
        }catch(err){
            console.log("get user error ",err)
        }
     
    };
    useEffect(()=>{
        getUser();
    },[userId])


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
        friends,picture
    }=user;
 
return(
    <WidgetWrap>
        <FlexBetween gap={"0.5rem"} pb={"1.1rem"} >
         <FlexBetween>
            <UserImage image={picture} />
            <Box onClick={()=>{navigate(`/profile/${userId}`)}}>
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
           
         </FlexBetween>
         <ManageAccountsOutlined onClick={()=>{navigate(`/profile/editProfile/${userId}`)}}/>
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
   { /**third row */}
   <Box p={"1rem 0"}>
     <FlexBetween mb={"0.5rem"}>
       <Typography color={medium}>Who viewed your profile?</Typography>
        <Typography color={medium} fontWeight={"500"}>{viewedprofile}</Typography>
     </FlexBetween>
     <FlexBetween mb={"0.5rem"}>
       <Typography color={medium}>Profile impressins</Typography>
        <Typography color={medium} fontWeight={"500"}>{impressions}</Typography>
     </FlexBetween>
       <FlexBetween mb={"0.5rem"}>
       
        <Typography color={medium} fontWeight={"500"} mb={"1rem"}>social profiles</Typography>
        <FlexBetween gap={"1rem"} mb={".5rem"}>
            <FlexBetween gap={"1rem"}>
                <image src="../uploads" alt="twitterimage"/>
                <Box>
                     <Typography color={medium} fontWeight={"500"}>Twitter</Typography>
                     <Typography color={medium}>social Networks</Typography>
                  
                </Box>
            </FlexBetween>
            <EditOffOutlined sx={{color:main}}></EditOffOutlined>
        </FlexBetween>
        <FlexBetween gap={"1rem"} mb={".5rem"}>
            <FlexBetween gap={"1rem"}>
                <image src="../uploads" alt="linkdin image"/>
                <Box>
                     <Typography color={medium} fontWeight={"500"}>Linkdin</Typography>
                     <Typography color={medium}>social Networks</Typography>
                  
                </Box>
            </FlexBetween>
            <EditOffOutlined sx={{color:main}}></EditOffOutlined>
        </FlexBetween>
     </FlexBetween>

   </Box>
<SugggestedFriends />
        
    </WidgetWrap>
)
}
export default UserWidget;