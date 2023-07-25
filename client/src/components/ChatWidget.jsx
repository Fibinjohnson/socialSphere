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
    console.log(chatName,"chatname")
    const [message,setMessage]=useState('');
    const allChats=useSelector((state)=>state.allChats)
    console.log(allChats,"message list")
    const [scrollTop, setScrollTop] = useState(0);
    const [receivedData,setReceivedData]=useState('');
    
    
  
    const postChat=async()=>{
      const response=await fetch(`http://localhost:3001/chats/${chatName.user}/${chatName.currentChat}`,{
        method:'POST',
        headers:{Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json'},
        body: JSON.stringify({message})
      })
      const data=await response.json();
      console.log(data,"chat data");
      socket.current.emit('send-msg',{
        to:chatName.currentChat,
        from:chatName.user,
        messageData:message
      })
      console.log(socket.current,'socket current')
      setMessage('')
    }
    useEffect(()=>{
      if(socket.current)
      {socket.current.on('receive_data',
      (data)=>{setReceivedData(data);
        console.log(data,'received data')})}},
    [receivedData])
    console.log(receivedData,'received data')
    const getChat=async()=>{
      const response=await fetch(`http://localhost:3001/chats/getChats/${chatName.user}/${chatName.currentChat}`,{
        method:'GET',
        headers:{Authorization:`Bearer ${token}`}
      })
      const data = await response.json();
      console.log(data,"getusers data");
      dispatch(setAllChats({allChats:data}))
  
    }
    const notAllChats=allChats[0]===null;

    const mappedChat= !notAllChats && allChats.map((chat)=>{
      return{
        myself:chat.sender[0]===chatName.user,
         message:chat.message.text
      }
    })

    const handleScroll = event => {
      setScrollTop(event.currentTarget.scrollTop);
    };


    useEffect(()=>{
     if(chatName){
       socket.current = io.connect("http://localhost:3001",{
       transports: ["websocket"],
  });
  socket.current.emit("add-user",chatName.user)
     }
    },[chatName])

    // useEffect(()=>{
    //   if (socket) {
    //   socket.on('receive_data', (data) => {
    //     console.log(data, "data");
    //     setMessageList((list)=>[...list,data])
    //   });
    // }},[socket])

    useEffect(()=>{
      getChat()
    },[chatName])
   
  
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
  mappedChat &&
  mappedChat.map((chat) =>
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
