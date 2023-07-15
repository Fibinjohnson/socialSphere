import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { setPosts} from "state";
import PostWidget from "./PostWidget";

const PostsWidget=({userId,isProfile=false})=>{
    const dispatch=useDispatch();
    const posts=useSelector((state)=>state.posts)
    console.log(posts,"like updated posts")
    const token=useSelector((state)=>state.token)
    const getPosts=async()=>{
        try{
            const postResponse=await fetch('http://localhost:3001/posts',{
                method:"GET",
                headers:{Authorization:`Bearer ${token}`}
            });
            const data=await postResponse.json()
            console.log(data,"user feed data")
            dispatch(setPosts({posts:data}))

        }catch(err){
            console.log("get feedPosts error",err)

        }
      
    }
    const getUserPosts=async()=>{
        const response=await fetch(`https://localhost:3001/posts/${userId}/post`,{
            method:"GET",
            headers:{Authorization:`Bearer ${token}`},
        });
        const data=await response.json()
        dispatch(setPosts({posts:data}))
    };
    useEffect(()=>{
        if(isProfile){
            getUserPosts()
        }else{
            getPosts()
        }
    },[])
    console.log(typeof posts,"type")
    console.log("feed post",posts)
    return(
        <>
        {posts && posts.map((post) => (
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
                comments={post.comments}
            />
        ))}
    </>
    
    )

}
export default PostsWidget;