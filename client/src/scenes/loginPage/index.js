import {useTheme,useMediaQuery,Typography,Box} from "@mui/material"
import Form from "./Form";
import { useState } from "react";
 
const LoginPage=()=>{
    const theme =useTheme();
    const isNonMobileScreen=useMediaQuery("(min-width:1000px)");
    const [loginPage,setPageType]=useState(true)

    return <Box>
    <Box width={"100%"}  backgroundColor={theme.palette.background.alt} p={"1rem 6%"}>
        <Typography fontWeight={"bold"}
         fontSize="32px"
         color={"primary"}>{loginPage?'Login now':'Register Now'}
        </Typography>
        </Box>
        <Box width={isNonMobileScreen?"50%":"93%"}
        p={"2rem"}
        m="2rem auto"
        borderRadius={'1.5rem'}
        backgroundColor={theme.palette.background.alt}
        >
      

        </Box>
        <Box>
           <Form pageType={setPageType} ></Form>
        </Box>
    </Box>
}
export default LoginPage;