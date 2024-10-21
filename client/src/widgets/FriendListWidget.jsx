import { Box,Typography,useTheme } from "@mui/material"
import Friend from "components/Friend"
import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import{setFriendsDetails} from "state"
import WidgetWrap from "components/WidgetWrap"
import config from 'config'
function FriendListWidget({userId}) {
    const {palette}=useTheme();
    const dispatch=useDispatch()
    const token=useSelector((state)=>state.token)
    const friendDetails=useSelector((state)=>state.friendDetails)
    const getFriends=async()=>{
        const response= await fetch(`${config.API_SERVER}/users/${userId}/friends`,{
            method:"GET",
            headers: {Authorization:`Bearer ${token}`}
        })
        const data= await response.json();
        console.log(data,"detaaaaaaaaaa")
        dispatch(setFriendsDetails({details:data?data:[]}))
       
    }
    useEffect(()=>{
      getFriends()
    },[userId])

  return (
    <>
   <WidgetWrap>
    <Typography color={palette.neutral.dark}
    variant="h5"
    fontWeight={"500"}
    sx={{mb:"1.5rem"}}
    >
       Friends 
      

    </Typography>
    <Box display={"flex" } flexDirection={"column"} gap="1.5rem"> 
    {Array.isArray(friendDetails) && friendDetails.length > 0 ? (
  friendDetails.map((friend) => (
    <Friend 
      key={friend._id} 
      friendId={friend._id} 
      userData={friend} 
      name={`${friend.firstname} ${friend.lastname}`} 
      userPicturePath={friend.picture} 
      subtitle={friend.occupation} 
    />
  ))
) : (
  <p>No friends to display</p>
)}

    </Box>
   </WidgetWrap>
   
   </>
  
   
  )
}

export default FriendListWidget
