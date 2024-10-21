import { PersonAddOutlined,PersonRemoveOutlined } from "@mui/icons-material"
import { Box,IconButton,Typography,useTheme } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux"
import FlexBetween from "./Flexbetween";
import UserImage from "./UserImages.jsx";
import { useNavigate } from "react-router-dom";
import { setChatName } from "state";
import Modal from "./Modal";


function Friend({userData, chatpage}) {
  const {_id:friendId,
             firstname,
             lastname, 
             picture:userPicturePath, 
             occupation:subtitle
          }= userData
   console.log(userData,"userDate")
    const {palette}=useTheme();
    const name=`${firstname} ${lastname}`
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {_id}=useSelector((state)=>state.user)
    const senderName=useSelector((state)=>state.user.firstname)
    const [friendList,setFriendList]=useState([])
    const friends=useSelector((state)=>state.user.friends)
    
    const [openModal,setOpenModal]=useState(false)
    const primaryDark=palette.primary.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
    const isFriend=friendList.includes(friendId);
    const yourSelf=(friendId===_id);
    useEffect(()=>{
     setFriendList(friends)
    },[friends])
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
    return (
        <>
          {openModal ? (
            <Modal
              setOpenModal={setOpenModal}
              isFriend={isFriend}
              selectedUser={userData}
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
