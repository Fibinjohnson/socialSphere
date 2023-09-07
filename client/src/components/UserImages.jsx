import { Box } from "@mui/material";
import React from 'react'
import config from '../config';

const UserImage=({image,size="60px"}) =>{
  return (
   <Box width={size} height={size}>
    <img style={{objectFit:"cover",borderRadius:"50%"}}
    width={size} height={size} 
    alt={"users"}
    src={`${config.API_SERVER}/assets/${image}`}>

    </img>

   </Box>
  )
}

export default UserImage;