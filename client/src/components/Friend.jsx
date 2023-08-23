import { PersonAddOutlined,PersonRemoveOutlined } from "@mui/icons-material"
import { Box,IconButton,Typography,useTheme } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import { useSelector,useDispatch } from "react-redux"
import { setFriends } from "state"
import FlexBetween from "./Flexbetween";
import UserImage from "./UserImages.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setChatName } from "state";
import Modal from "./Modal";



function Friend({friendId,name,subtitle,userPicturePath, chatpage}) {
    const {palette}=useTheme();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {_id}=useSelector((state)=>state.user)
    const senderName=useSelector((state)=>state.user.firstname)
    const token=useSelector((state)=>state.token)
    const friends=useSelector((state)=>state.user.friends)
    const yesFriendsArray=friends.length>0;
    const arrayFriends=yesFriendsArray ?friends:friends 
    const [openModal,setOpenModal]=useState(false)
    const primaryLight=palette.primary.light
    const primaryDark=palette.primary.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
    const isFriend=arrayFriends.includes(friendId);
    const yourSelf=(friendId===_id);
    const handleChatClick=async()=>{
      dispatch(
        setChatName({
          chatName: {
            userName: name,
            sender:senderName,
            user: _id,
            currentChat:friendId,
            path:userPicturePath
            
          },
        })
      );
    }
  
  

    const patchFriend=async()=>{
       const response= await fetch(`http://localhost:3001/users/${_id}/${friendId}`,{
            method:"PATCH",
            headers:{Authorization:`Bearer ${token}`},
            "Content-Type":"application/json"
        })
        const data=await response.json();
        const isArray=data.length>0;
       const arrayOfFriends=isArray ?data[0].allFriends:data 
        dispatch(setFriends({friends:arrayOfFriends}))
    }
    return (
        <>
          {openModal ? (
            <Modal
              setOpenModal={setOpenModal}
              patchFriend={patchFriend}
              isFriend={isFriend}
              name={name}
            />
          ) : (
            <FlexBetween>
              <FlexBetween gap={"1rem"}>
                <UserImage size="55px" image={userPicturePath} />
                <Box onClick={() => navigate(`/profile/${friendId}`)}>
                  <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                      "$:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography color={medium} fontSize="0.75rem">
                    {subtitle}
                  </Typography>
                </Box>
              </FlexBetween>
              {!chatpage?(<Box>
              {!yourSelf && (
                <IconButton onClick={() => setOpenModal(true)}>
                  {isFriend ? (
                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                  ) : (
                    <PersonAddOutlined sx={{ color: primaryDark }} />
                  )}
                </IconButton>
              )}
              </Box>):<IconButton onClick={handleChatClick}><ChatIcon/></IconButton>}
            </FlexBetween>
          )}
        </>
      );
      
}

export default Friend
