import { Box ,useMediaQuery} from "@mui/material";
import NavPage from "scenes/navbarPage";
import UserWidget from "widgets/UserWidget"
import MyPostsWidgets from "widgets/MyPostsWidgets";
import PostsWidget from "widgets/PostsWidget";
import { useSelector } from "react-redux";
import AdvertWidget from "widgets/AdvertWidget";
import FriendListWidget from "widgets/FriendListWidget";

const HomePage=()=>{
  const isNonMobileScreen=useMediaQuery('(min-width:1000px)')
  const {_id,picturePath}=useSelector((state)=>state.user )
    return <Box>
        <NavPage/>
        <Box sx={{width:"100%"}}
         padding="2rem 6%"
         display={isNonMobileScreen?"flex":"block"}
         >
          <Box flexBasis={isNonMobileScreen?"26%":undefined}>
            <UserWidget userId={_id} picturePath={picturePath}/>
            <Box flexBasis={isNonMobileScreen?"42%":undefined}
            mt={isNonMobileScreen?undefined:"2rem"}>
              <MyPostsWidgets picturePath={picturePath}/>
              <PostsWidget userId={_id}/>

            </Box>
          </Box>
          {isNonMobileScreen && (
            <Box flexBasis={"26%"}>

            <AdvertWidget/>
            <Box margin={"2rem 0"}><FriendListWidget userId={_id}/></Box>
            </Box>
          )}
        </Box>
   </Box>
}
export default HomePage;