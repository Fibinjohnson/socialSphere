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
    },
    setFriendsDetails:(state,action)=>{
        state.friendDetails=action.payload.details;
    },
    setChatName:(state,action)=>{
        state.chatName=action.payload.chatName;
    },
    setEditeduser:(state,action)=>{
        state.user=action.payload.user;
    },
    addOrRemoveUser:(state,action)=>{
     const friend = state.friendDetails.find((friends) => friends._id === action.payload.user._id);

     if (friend) {
       return {
         ...state,
         friendDetails: state.friendDetails.filter((friends) => friends._id !== action.payload.user._id)
       };
     } else {
       return {
         ...state,
         friendDetails: [...state.friendDetails, action.payload.user]
       };
     }
     
    }
    

}
})
export const {setMode,setLogin,setLogout,setPost,setPosts,setFriends,setFriendsDetails,setChatName,setEditeduser,addOrRemoveUser}=authSlice.actions;
export default authSlice;