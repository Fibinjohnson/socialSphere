import { useState ,useEffect} from "react";
import ChatWidget from "components/ChatWidget";
import { useSelector } from "react-redux";
import Friend from "components/Friend";
import { Box } from "@mui/material";



function ChatPage() {
    const loggedInUser=useSelector((state)=>state.user)
    const token=useSelector((state)=>state.token)
    const [userFriends, setUserFriends] = useState([]);

    const getFriends=async()=>{
      const response=await fetch(`http://localhost:3001/users/${loggedInUser._id}/friends`,{
        method:"GET",
        headers:{"Authorization":`Bearer ${token}`}
      })
      const data=await response.json();
       setUserFriends(data)
    }
 
  useEffect(()=>{getFriends()},[])
  
  return (
    <Box display={"flex"} justifyContent={"space-between"}>
    <Box p={"20px"} display={"flex"} flexDirection={"column"}>
     {userFriends && userFriends.map((userFriend)=>(
      <Box pr={"12px"} paddingBottom={"12px"}>
      <Friend friendId={userFriend._id} 
          name={`${userFriend.firstname} ${userFriend.lastname}`} 
          userPicturePath={userFriend.picture} 
            chatpage
          />
     </Box>
      ))} 
   
     </Box>
     <ChatWidget/>
    </Box>
  )
}

export default ChatPage
{/* <div className="App">
    {!showChat ? (
      <div className="joinChatContainer">
        <h3>Join A Chat</h3>
        <input
          type="text"
          placeholder="John..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Room ID..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}>Join A Room</button>
      </div>
    ) : (
      <Chat socket={socket} username={username} room={room} />
    )}
  </div> */}