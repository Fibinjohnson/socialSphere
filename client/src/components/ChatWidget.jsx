import React from 'react'
import {  Box,Divider,Typography,IconButton,useTheme, Input} from '@mui/material'
import WidgetWrap from './WidgetWrap';
import FlexBetween from './Flexbetween'
import { Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001",{
    transports: ["websocket"],
  });
function ChatWidget({username}) {
    const {palette}=useTheme();
    const primaryLight=palette.primary.light
    const primaryDark=palette.primary.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
    const chatName=useSelector((state)=>state.chatName)
    const [message,setMessage]=useState('');
    const [messageList,setMessageList]=useState([]);
    console.log(messageList,'message')
    async function sendMessage(){
        const messageData={
            message:message,
            chatDetails:chatName,
            date: new Date().getHours() + ":" + new Date().getMinutes()
        }
        await socket.emit('send_data',messageData)
    }
    useEffect(()=>{socket.on('receive_data',(data)=>{console.log(data);setMessageList((list)=>[...list,data]) })},[socket])
  return ( 
    <WidgetWrap  position={"relative"} m={"2rem 4rem"} height={"400px"} width={"300px"}>
    
    <Typography position={'absolute'}  left={0} right={0} >
        {chatName.userName}
    </Typography>
    <FlexBetween position={'absolute'}  left={0} right={0}  backgroundColor='white' sx={{height:"300px",width:"100%", top:"45px"}} >
    hh
    </FlexBetween>
    <Box position={'absolute'} bottom={"15px"} display="flex">
    <Input placeholder='Type somthing here...' onChange={(e)=>{setMessage(e.target.value)}} value={message} style={{ width: "220px" }} type='text'></Input>
    <IconButton onClick={sendMessage}><Send/></IconButton>
    </Box>
    </WidgetWrap>
  )
}

export default ChatWidget
