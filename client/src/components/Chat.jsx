// import React from 'react'
// import { useState ,useEffect} from 'react'

// function Chat({socket,username,room}) {
//     const [message,setMessage]=useState('');
//     const [messageList,setMessageList]=useState([]);

//     async function sendMessage(){
//         if(message!==''){
//             const messageData = {
//                 message: message,
//                 user: username,
//                 group: room,
//                 date: new Date().getHours() + ":" + new Date().getMinutes()
//             };
            
           
//             await socket.emit('send_data',messageData)
//         }
//     }
//     useEffect(()=>{socket.on('receive_data',(data)=>{setMessageList((list)=>[...list,data]) })},[socket])
//   return (
  
//     <div>
//       {messageList&& messageList.map((message)=>
//       <div><h4>{message.user}</h4><h5>{message.message}</h5></div>
//           ) }
//       <input type='text' placeholder='type something' onChange={(e)=>{setMessage(e.target.value)}} value={message}></input>
//       <button onClick={sendMessage}>send </button>
//     </div>
//   )
// }

// export default Chat
