import {createSlice} from "@reduxjs/toolkit"
const initialState={
    mode:"dark",
    name:null,
    posts:[],
    token:"null",
    user:{
        friends:[]
    },
    friendDetails:[],
    chatName:[],
};
export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
    setMode:(state)=>{
      state.mode=state.mode==="dark"?"light":"dark";
    },
    setLogin:(state,action)=>{
        console.log(action,"actionn")
        state.user=action.payload.user;
        state.token=action.payload.token;
    },
    setLogout:(state)=>{
        state.user=null;
        state.token=null;
        state.allChats=[];
        
    },
    setFriends:(state,action)=>{
        if(state.user){
            state.user.friends=action.payload.friends;
        }else{
            console.error("No user found")
        }
    },
    setPosts:(state,action)=>{
         state.posts=action.payload.posts;
    },
    setPost:(state,action)=>{
        const updatedPost=state.posts.map((post)=>{
            if(post._id===action.payload.post._id){
                return action.payload.post;
            }else{
                return post;
            }
        })
        state.posts=updatedPost;
    },setFriendsDetails:(state,action)=>{
        state.friendDetails=action.payload.details;
    },
    setChatName:(state,action)=>{
        state.chatName=action.payload.chatName;
    },
    setEditeduser:(state,action)=>{
        state.user=action.payload.user;
    }

}
})
export const {setMode,setLogin,setLogout,setPost,setPosts,setFriends,setFriendsDetails,setChatName,setEditeduser}=authSlice.actions;
export default authSlice;