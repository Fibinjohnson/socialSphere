import React from 'react'
import { PersonAddOutlined,PersonRemoveOutlined } from "@mui/icons-material"
import { Box,IconButton,Typography,useTheme } from "@mui/material"
import { useSelector,useDispatch } from "react-redux"
import { setFriends } from "state"
import FlexBetween from "./Flexbetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import Modal from "./Modal";

function SugggestedFriends() {
    const {palette}=useTheme();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {_id}=useSelector((state)=>state.user)
    const token=useSelector((state)=>state.token)
   
    const friends=useSelector((state)=>state.user.friends)
    const yesFriendsArray=friends.length>0;
    const [allUsers,setAllUsers]=useState([])
    
const getAllUsers = async () => {
  try {
    const response = await fetch(`http://localhost:3001/users/allusers/${_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header correctly
      },
    });
    const data = await response.json();
    setAllUsers(data);
    console.log(data, "get all users");
  } catch (error) {
    console.error(error);
  }
};

    useEffect(()=>{getAllUsers()},[])
    console.log(allUsers,"all users")
  return (
  
//     <FlexBetween>
//     <FlexBetween gap={"1rem"}>
//       <UserImage size="55px" image={userPicturePath} />
//       <Box onClick={() => navigate(`/profile/${friendId}`)}>
//         <Typography
//           color={main}
//           variant="h5"
//           fontWeight="500"
//           sx={{
//             "$:hover": {
//               color: palette.primary.light,
//               cursor: "pointer",
//             },
//           }}
//         >
//           {name}
//         </Typography>
//         <Typography color={medium} fontSize="0.75rem">
//           {subtitle}
//         </Typography>
//       </Box>
//     </FlexBetween>
//     {!yourSelf && (
//       <IconButton onClick={() => setOpenModal(true)}>
//         {isFriend ? (
//           <PersonRemoveOutlined sx={{ color: primaryDark }} />
//         ) : (
//           <PersonAddOutlined sx={{ color: primaryDark }} />
//         )}
//       </IconButton>
//     )}
//   </FlexBetween>
<h2>here it is, </h2>
  )
}

export default SugggestedFriends
