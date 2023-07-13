import { Box,Typography,useTheme } from "@mui/material"
import Friend from "components/Friend"
import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import { setFriends } from "state"
import WidgetWrap from "components/WidgetWrap"
function FriendListWidget({userId}) {
    const {palette}=useTheme();
    const dispatch=useDispatch()
    const token=useSelector((state)=>state.token)
    const friends=useSelector((state)=>state.user.friends)
    const getFriends=async()=>{
        const response= await fetch(`http://localhost:3001/users/${userId}/friends`,{
            method:"GET",
            headers: {Authorization:`Bearer ${token}`}
        })
        const data= await response.json();
        dispatch(setFriends({friends:data})) 
    }
    useEffect(()=>{
      getFriends()
    },[])
  return (
   <WidgetWrap>
    <Typography color={palette.neutral.dark}
    variant="h5"
    fontWeight={"500"}
    sx={{mb:"1.5rem"}}
    >
      Friend List
    </Typography>
    <Box display={"flex" } flexDirection={"column"} gap="1.5rem"> 
    {/* {friends.map((friend)=>{
        <Friend key={friend._id} friendId={friend._id} name={`${friend.firstName} ${friend.lastName}`} userPicturePath={friend.picturePath} subtitle={friend.occupation}/> 
    })

    } */}
    </Box>
   </WidgetWrap>
  )
}

export default FriendListWidget
