import React from 'react'
import {  Box,Divider,Typography,IconButton,useTheme, Input} from '@mui/material'
import WidgetWrap from './WidgetWrap';
import { Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import ChatHeader from './chatHeader';
import Scrollbars from 'react-custom-scrollbars-2';
import { setAllChats } from 'state';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import io from "socket.io-client";




function ChatWidget() {
  const dispatch=useDispatch();
  const socket=useRef();
    const {palette}=useTheme();
    const primaryLight=palette.primary.light
    const primaryDark=palette.primary.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
    const chatName=useSelector((state)=>state.chatName)
    const token=useSelector((state)=>state.token)
    const userLoggedin=useSelector((state)=>state.user)
    const [message,setMessage]=useState('');
    const allChats=useSelector((state)=>state.allChats)
    const [scrollTop, setScrollTop] = useState(0);
    const [chatMessage,setChatMessage]=useState([])

    console.log(allChats,'allchats')
  
    const postChat=async()=>{
      const response=await fetch(`http://localhost:3001/chats/${chatName.user}/${chatName.currentChat}`,{
        method:'POST',
        headers:{Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json'},
        body: JSON.stringify({message})
      })
      const data=await response.json(); 
      socket.current.emit('send-msg',{
        to:chatName.currentChat,
        from:chatName.user,
        messageData:message
      })
      const msgs=[...chatMessage]
      msgs.push({myself:true,message:message})
      setChatMessage(msgs)
      setMessage('')
    }
   const dispatchChat=async()=>{
    dispatch(setAllChats({allChats:[]}))
   }

    const getChat=async()=>{
      const response=await fetch(`http://localhost:3001/chats/getChats/${chatName.user}/${chatName.currentChat}`,{
        method:'GET',
        headers:{Authorization:`Bearer ${token}`}
      })
      const data = await response.json();
      console.log(data,"getusers data");
      const mappedChat=   data.map((chat)=>{
        return{
          myself:chat.sender[0]===chatName.user,
           message:chat.message.text
        }
      })
     
      dispatch(setAllChats({allChats:mappedChat}))

  
    }
    const handleScroll = event => {
      setScrollTop(event.currentTarget.scrollTop);
    };

    useEffect(() => {
      if (userLoggedin) {
        socket.current = io.connect("http://localhost:3001", {
          transports: ["websocket"],
        });
        socket.current.emit("add-user", userLoggedin._id);
      }
    }, [userLoggedin]);
    
    useEffect(() => {
      if (socket.current) {
        socket.current.on('receive_data', (data) => {
          setChatMessage((prev)=> [...prev,{myself:false,message:data}]);
        });
      }
    }, [chatMessage]);
    useEffect(()=>{
       dispatchChat()
    },[chatName])

    useEffect(()=>{
      getChat()
    },[chatMessage])


  
   
  
  return ( 
    <>
     
  <WidgetWrap  position={"relative"} m={"1rem 4rem"} height={"550px"} width={"870px"}>
    
  <ChatHeader name={chatName.userName} userPicturePath={chatName.path}/>
  <Scrollbars style={{
  width: '840px',
  height: '400px',
  position:'absolute',
  marginTop:'20px',
  marginLeft:'5px',
  marginRignt:'5px',
  
}}
    onScroll={handleScroll}
    autoHide
   >
  {
  allChats[0]!==null &&
  allChats.map((chat) =>
    chat.myself ? (
      <Box marginTop={'20px'}>
        <Typography fontFamily={'initial'}>{chat.message}</Typography>
      </Box>
    ) : (
      <Box  marginTop={'20px'} width={"800px"} >
        <Typography sx={{ textAlign:'right'}}>{chat.message}</Typography>
      </Box>
    )
  )
}
   
  </Scrollbars>
   
     <Box position={'absolute'} bottom={"15px"} display="flex">
     <Input placeholder='Type somthing here...' onChange={(e)=>{setMessage(e.target.value)}} value={message} style={{ width: "750px" }} type='text'></Input>
     <IconButton onClick={()=>{postChat()}}><Send/></IconButton>
     </Box>
     </WidgetWrap>
    </>
  
  )
}

export default ChatWidget
