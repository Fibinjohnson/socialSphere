import { PersonAddOutlined,PersonRemoveOutlined } from "@mui/icons-material"
import { Box,IconButton,Typography,useTheme } from "@mui/material"
import { useSelector,useDispatch } from "react-redux"
import { setFriends } from "state"
import FlexBetween from "./Flexbetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
function Friend({friendId,name,subtitle,userPicturePath}) {
    const {palette}=useTheme();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {_id}=useSelector((state)=>state.user)
    const token=useSelector((state)=>state.token)
    const friends=useSelector((state)=>state.user.friends)
    const primaryLight=palette.primary.light
    const primaryDark=palette.primary.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
    const isFriend=friends.find((friend)=>friend._id===friendId)

    const patchFriend=async()=>{
       const response= await fetch(`https://localhost:3001/${_id}/${friendId}`,{
            method:"PATCH",
            headers:{Authorization:`Bearer${token}`},
            "Content-Type":"application/json"
        })
        const data=await response.json();
        dispatch(setFriends({friends:data}))
    }
  return (
   <FlexBetween>
    <FlexBetween gap={"1rem"}>
     <UserImage size="55px" image={userPicturePath}>
     </UserImage>
     <Box onClick={()=>{navigate(`/profile/${friendId}`)}}>
        <Typography color={main}
        variant="h5"
        fontWeight="500"
        sx={{
            "$ :hover":{
                color:palette.primary.light,
                cursor:"pointer"
            }
        }}>
        {name}
        </Typography>
        <Typography color={medium}
        fontSize="0.75rem">
        {subtitle}
        </Typography>

     </Box>
    </FlexBetween>
    <IconButton onClick={()=>{patchFriend()}}>
        {isFriend?<PersonAddOutlined sx={{color:primaryDark}}/>:<PersonRemoveOutlined sx={{color:primaryDark}}/>}
    </IconButton>
   </FlexBetween>
  )
}

export default Friend
