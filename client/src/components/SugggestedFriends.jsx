import React from 'react'
import { Box,Typography,useTheme } from "@mui/material"
import { useSelector,useDispatch } from "react-redux"
import FlexBetween from "./Flexbetween";
import UserImage from "./UserImages.jsx";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

function SugggestedFriends() {
    const {palette}=useTheme();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {_id}=useSelector((state)=>state.user)
    const token=useSelector((state)=>state.token)
    const main=palette.neutral.main
    const medium=palette.neutral.medium
   
    const friends=useSelector((state)=>state.user.friends)
    const yesFriendsArray=friends.length>0;
    const [allUsers,setAllUsers]=useState([])
  
    
    
const getAllUsers = async () => {
  try {
    const response = await fetch(`http://localhost:3001/users/${_id}/allusers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const dataExceptUser=data.filter((user)=>user._id!==_id)
    setAllUsers(dataExceptUser)
  } catch (error) {
    console.error(error);
  }
};

    useEffect(()=>{getAllUsers()},[])
    return (
      <div >
      <h3>People you might know</h3>
        {allUsers &&
          allUsers.map((user) => (
            <FlexBetween key={user._id}>
              <FlexBetween gap={"1rem"} paddingTop={"20px"}>
                <UserImage size="55px" image={user.picture} />
                <Box onClick={() => navigate(`/profile/${user._id}`)}>
                  <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                      ":hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  >
                    {`${user.firstname} ${user.lastname}`}
                  </Typography>
                  <Typography color={medium} fontSize="0.75rem">
                    {user.subtitle}
                  </Typography>
                </Box>
              </FlexBetween>
              {/* {!yourSelf && (
                <IconButton onClick={() => setOpenModal(true)}>
                  {user.isFriend ? (
                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                  ) : (
                    <PersonAddOutlined sx={{ color: primaryDark }} />
                  )}
                </IconButton>
              )} */}
            </FlexBetween>
          ))}
      </div>
    );
    
}

export default SugggestedFriends
