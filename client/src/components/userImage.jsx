import { Box } from "@mui/material";
import React from 'react'

function UserImage({image,size="60px"}) {
  return (
   <Box width={size} height={size}>
    <img style={{objectFit:"cover",borderRadious:"50%"}}
    width={size} height={size}
    alt={"users"}
    src={`http://localhost:3001/assets/${image}`}>

    </img>

   </Box>
  )
}

export default UserImage
