import React from 'react'
import {  Box,Divider,Typography,IconButton,useTheme, Input} from '@mui/material'
import WidgetWrap from './WidgetWrap';
import FlexBetween from './Flexbetween'
import { Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import ChatHeader from './chatHeader';
import { json } from 'react-router-dom';

function ChatWidget() {
    const {palette}=useTheme();
    const primaryLight=palette.primary.light
    const primaryDark=palette.primary.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
    const chatName=useSelector((state)=>state.chatName)
    const socket=chatName.socket;
    const token=useSelector((state)=>state.token)
    console.log(chatName,"chatname")
    const [allChats,setAllChats]=useState([]);

    // const socket=chatName.socket
    const [message,setMessage]=useState('');
    const [messageList,setMessageList]=useState([]);
    console.log(message,"message list")
 

    const postChat=async()=>{
      const response=await fetch(`http://localhost:3001/chats/${chatName.user}/${chatName.currentChat}`,{
        method:'POST',
        headers:{Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json'},
        body: JSON.stringify({message})
      })
      const data=await response.json();
      console.log(data,"chat data");
      setMessage('')
    }
    const getChat=async()=>{
      const response=await fetch(`http://localhost:3001/chats/getChats/${chatName.user}/${chatName.currentChat}`,{
        method:'GET',
        headers:{Authorization:`Bearer ${token}`}

      })
      const data = await response.json();
      console.log(data,"getusers data");
      setAllChats(data);
    }
    const mappedChat=allChats.map((chat)=>{
      return{
        myself:chat.sender===chatName.user,
         message:chat.message.text
      }
    })
console.log(mappedChat,"mappedChat")
    
    async function sendMessage(){
        const messageData={
            message:message,
            to:chatName.currentChat,
            from:chatName.user,
          
        }
        await socket.emit('send-msg',{
          messageData
        })
    }
    useEffect(()=>{
      if (socket) {
      socket.on('receive_data', (data) => {
        console.log(data, "data");
        setMessageList((list)=>[...list,data])
      });
    }},[socket])

    useEffect(()=>{
      getChat()
    },[chatName])
  return ( 
    <>
     
  <WidgetWrap  position={"relative"} m={"1rem 4rem"} height={"550px"} width={"870px"}>
    
  <ChatHeader name={chatName.userName} userPicturePath={chatName.path}/>
  <Box position={'absolute'} >

  </Box>
   
     <Box position={'absolute'} bottom={"15px"} display="flex">
     <Input placeholder='Type somthing here...' onChange={(e)=>{setMessage(e.target.value)}} value={message} style={{ width: "800px" }} type='text'></Input>
     <IconButton onClick={()=>{postChat()}}><Send/></IconButton>
     </Box>
     </WidgetWrap>
    </>
  
  )
}

export default ChatWidget
