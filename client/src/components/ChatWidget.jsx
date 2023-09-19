import React from 'react'
import {  Box,Typography,IconButton,useTheme, Input} from '@mui/material'
import WidgetWrap from './WidgetWrap';
import { Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import ChatHeader from './chatHeader';
import Scrollbars from 'react-custom-scrollbars-2';
import { useRef } from 'react';
import io from "socket.io-client";
import config from '../config'




function ChatWidget() {
  
  const socket=useRef();
    const {palette}=useTheme();
    const primaryLight=palette.primary.light
    const chatName=useSelector((state)=>state.chatName)
    const token=useSelector((state)=>state.token)
    const userLoggedin=useSelector((state)=>state.user)
    const [message,setMessage]=useState('');
    const [scrollTop, setScrollTop] = useState(0);
    const [chatMessage,setChatMessage]=useState([])
    const [allChats,setAllChats]=useState([])
  
   


    const postChat=async()=>{
      const response=await fetch(`${config.API_SERVER}/chats/${chatName.user}/${chatName.currentChat}`,{
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

   
    const handleKeyDown=async(event)=>{
      if(event.key==='Enter'){
         postChat()
      }
    }

   const dispatchChat=async()=>{
     setAllChats(allChats)
   }

    const getChat=async()=>{
      const response=await fetch(`${config.API_SERVER}/chats/getChats/${chatName.user}/${chatName.currentChat}`,{
        method:'GET',
        headers:{Authorization:`Bearer ${token}`}
      })
      const data = await response.json();
      const mappedChat=   data.map((chat)=>{
        return{
          myself:chat.sender[0]===chatName.user,
           message:chat.message.text
        }
      })
      setAllChats(mappedChat)
    }
    const handleScroll = (event) => {
      setScrollTop(event.currentTarget.scrollTop);
    };

    useEffect(() => {
      if (userLoggedin) {
        socket.current = io.connect(`${config.CHAT_SERVER}`, {
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
    },[userLoggedin])

    useEffect(()=>{
      getChat()
    },[chatMessage,chatName])


  
   
  
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
  allChats.map((chat,index) =>
    chat.myself ? (
      <Box
      key={index}
      marginTop="20px"
      borderRadius="1.5rem"
      height="fit-content" 
      display="flex"
      flexWrap="wrap" 
      alignItems="flex-start" 
      alignContent="flex-start"
      backgroundColor={primaryLight}
      width="200px" 
      overflow="hidden" 
      p="10px"
    >
       <Typography
        fontFamily="initial"
        sx={{
          width: '100%', 
          wordBreak: 'break-all', 
          flex: '1 1 100%', 
        }}
      >
        {chat.message}
      </Typography>
    </Box>    
    ) : (
      <Box
      key={index}
      marginTop="20px"
      borderRadius="1.5rem"
      height="fit-content" 
      display="flex"
      flexWrap="wrap" 
      alignItems="flex-start" 
      alignContent="flex-start" 
      backgroundColor={primaryLight}
      width="200px" 
      overflow="hidden"    
      p="10px"
      marginLeft={'73%'}
    >
       <Typography
        fontFamily="initial"
        sx={{
          width: '100%', // Set a width to control when text starts wrapping
          wordBreak: 'break-all', // Allow words to break and wrap
          flex: '1 1 100%', // Let the text occupy all available space on a new line
        }}
      >
        {chat.message}
      </Typography>
    </Box>
    )
  )
}
   
  </Scrollbars>
   
     <Box position={'absolute'} bottom={"15px"} display="flex">
     <Input placeholder='Type somthing here...' onChange={(e)=>{setMessage(e.target.value)}} onKeyDown={handleKeyDown} value={message} style={{ width: "750px" }} type='text'></Input>
     <IconButton onClick={()=>{postChat()}}><Send/></IconButton>
     </Box>
     </WidgetWrap>
    </>
  
  )
}

export default ChatWidget
