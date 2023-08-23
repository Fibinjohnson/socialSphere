import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { setPosts} from "state";
import PostWidget from "./PostWidget";

const PostsWidget=({userId,isProfile=false})=>{
    const dispatch=useDispatch();
    const posts=useSelector((state)=>state.posts)
    const isPosts=posts.length>0;
    const token=useSelector((state)=>state.token)
    const getPosts=async()=>{
        try{
            const postResponse=await fetch('http://localhost:3001/posts',{
                method:"GET",
                headers:{Authorization:`Bearer ${token}`}
            });
            const data=await postResponse.json()
            dispatch(setPosts({posts:data}))

        }catch(err){
            console.log("get feedPosts error",err)

        }
      
    }
    const getUserPosts=async()=>{
        try{
            const response=await fetch(`http://localhost:3001/posts/${userId}/posts`,{
                method:"GET",
                headers:{Authorization:`Bearer ${token}`},
            });
            const data=await response.json()
            dispatch(setPosts({posts:data}))
        }catch(err){
            console.log(err,"get users in feed error")
        }
      
    };
    useEffect(()=>{
        if(isProfile){
            getUserPosts()
               // eslint-disable-next-line react-hooks/exhaustive-deps
        }else{
            getPosts()
               // eslint-disable-next-line react-hooks/exhaustive-deps
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userId])
    return(
        <>
        {isPosts ? posts.map((post) => (
            <PostWidget 
                key={post._id}
                PostId={post._id}
                userId={post.userId}
                name={`${post.firstName} ${post.lastName}`}
                description={post.description}
                location={post.location}
                picturePath={post.picturepath}
                userPicturePath={post.userPicturePath}
                likes={post.likes}
                comments={post.allComments}
            />
        )):<><h1>No posts to show</h1></>}
    </>
    
    )

}
export default PostsWidget;