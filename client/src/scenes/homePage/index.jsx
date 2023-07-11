import { Box ,useMediaQuery} from "@mui/material";
import NavPage from "scenes/navbarPage";
import UserWidget from "widgets/userWidget"
import MyPostsWidgets from "widgets/MyPostsWidgets";

const HomePage=()=>{
  const isNonMobileScreen=useMediaQuery('(min-width:100px)')
  const [_id,picturePath]=useState((state)=>{state.user })
    return <Box>
        <NavPage/>
        <Box width={"100px"}
         padding={"2rem 6%"}
         display={isNonMobileScreen?"flex":"block"}
         >
          <Box flexBasis={isNonMobileScreen?"26%":undefined}>
            <UserWidget userId={_id} picturePath={picturePath}/>
            <Box flexBasis={isNonMobileScreen?"42%":undefined}
            mt={isNonMobileScreen?undefined:"2rem"}></Box>
          </Box>
          {isNonMobileScreen && (
            <Box flexBasis={"26%"}></Box>
          )}
        </Box>
   </Box>
}
export default HomePage;