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
    const yesFriendsArray=friends.length>0;
    console.log(yesFriendsArray,"yesFriendsArray")
    const arrayFriends=yesFriendsArray ?friends[0].allFriends:friends 
    
    console.log(arrayFriends,"add reove friends")
    const primaryLight=palette.primary.light
    const primaryDark=palette.primary.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
    console.log(friends)
    const isFriend=arrayFriends.includes(friendId);
    console.log(isFriend,"friends")
    const yourSelf=(friendId===_id)

    const patchFriend=async()=>{
       const response= await fetch(`http://localhost:3001/users/${_id}/${friendId}`,{
            method:"PATCH",
            headers:{Authorization:`Bearer ${token}`},
            "Content-Type":"application/json"
        })
        const data=await response.json();
        console.log("add remove server",data,'servr')
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
    {!yourSelf && <IconButton onClick={()=>{patchFriend()}}>
        {isFriend?<PersonRemoveOutlined sx={{color:primaryDark}}/>:<PersonAddOutlined sx={{color:primaryDark}}/>}
    </IconButton>}
   
   </FlexBetween>
  )
}

export default Friend
