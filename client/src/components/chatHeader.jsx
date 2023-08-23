import { Box,Typography,useTheme } from "@mui/material"
import FlexBetween from "./Flexbetween";
import UserImage from "./UserImages.jsx";
import { useNavigate } from "react-router-dom";




function ChatHeader({friendId,name,userPicturePath}) {
    const {palette}=useTheme();
  
    const navigate=useNavigate();
    const main=palette.neutral.main
 


  

  
    return (
        <>
        
            <FlexBetween>
              <FlexBetween gap={"1rem"}>
                <UserImage size="55px" image={userPicturePath} />
                <Box onClick={() => navigate(`/profile/${friendId}`)}>
                  <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                      "$:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  >
                    {name} 
                  </Typography>
               
                </Box>
              </FlexBetween>
   
            </FlexBetween>
        
        </>
      );
      
}

export default ChatHeader
