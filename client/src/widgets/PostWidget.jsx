import PostsWidget from './PostsWidget'
import { ChatBubbleOutlineOutlined,FavoriteBorderOutlined,FavoriteOutlined,ShareOutlined } from '@mui/icons-material'
import { Box,Divider,Typography,IconButton,useTheme, Input } from '@mui/material'
import FlexBetween from 'components/Flexbetween'
import Friend from 'components/Friend';
import WidgetWrap from 'components/WidgetWrap';
import { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { setPost } from 'state'
import SendIcon from '@mui/icons-material/Send';


// import { boolean } from 'yup'

function PostWidget({ 
  PostId,
userId,
name ,
description,
location,
picturePath,
userPicturePath,
likes,
comments }) {
  const {palette}=useTheme();
    const dispatch=useDispatch();
    const [isComments,setIsComments]=useState(false)
    const loggedInUserId=useSelector((state)=>state.user._id)
    const token=useSelector((state)=>state.token)
    const [comment,setComment]=useState();
    
  
    const primary=palette.primary.main
    const main=palette.neutral.main
    const mainMedium=palette.neutral.medium
    const isLiked = likes.includes(loggedInUserId);
  
   
    const likeCount=Object.keys(likes).length
 

    const patchLike=async()=>{
      const response=await fetch(`http://localhost:3001/posts/${PostId}/like`,{
        method:"PATCH",
        headers:{"Authorization":`Bearer ${token}`,
        "Content-Type":"application/json"},
        body:JSON.stringify({userId:loggedInUserId})
       
      })
      const updatedPost=await response.json();
      dispatch(setPost({post:updatedPost}));
    }
    const patchComment=async()=>{
      const response=await fetch(`http://localhost:3001/posts/${PostId}/comment`,{
        method:"PATCH",
        headers:{"Authorization":`Bearer ${token}`,
            "Content-Type":"application/json"},
        body:JSON.stringify({userId:loggedInUserId,commentposted:comment})
      })
      const data=await response.json()
      // dispatch(setPost({post:data}))
      console.log(data,"commentdata")
    }

    return (
      <WidgetWrap m="2rem 0">
        <Friend
          friendId={userId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
            <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>2{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
  
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
          <Box display={'flex'}> 
          <Input onChange={(e)=>{setComment(e.target.value)}} value={comment} placeholder='write a comment' sx={{width:"100%"}}></Input>
          <SendIcon onClick={()=>{patchComment()}} sx={{":hover":{color:primary}}} /></Box>
         
            {/* {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))} */}
            <Divider />
          </Box>
        )}
      </WidgetWrap>
    );
}

export default PostWidget
 