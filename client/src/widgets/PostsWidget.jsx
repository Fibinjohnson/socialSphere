import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget=({userId,isProfile=false})=>{
    const dispatch=useDispatch();
    const posts=useSelector((state)=>state.posts)
    console.log(posts,"posts")
    const token=useSelector((state)=>state.token)
    const getPosts=async()=>{
        try{
            const postResponse=await fetch('https://localhost:3001/posts',{
                method:"GET",
                headers:{"Authorization":`Bearer ${token}`}
            });
            const data=await postResponse.json()
            console.log(data,"user Posts data")
            dispatch(setPosts({posts:data}))
        }catch(err){
            console.log(err,":er")
        }
      
    }
    const getUserPosts=async()=>{
        const response=await fetch(`https://localhost:3001/posts/${userId}/post`,{
            method:"GET",
            headers:{Authorization:`Bearer${token}`},
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
    })
    return(
        <>
            {posts &&(posts.map(({_id,
                userId,
                firstName,
                lastName,
                description,
                location,
                picturePath,
                userPicturePath,
                likes,
                comments,
                })=>{
                    <PostWidget 
                    key={_id}
                  PostId= {_id}
                userId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments} />

                }))
                
            }
        </>
    )

}
export default PostsWidget;