import { Box } from "@mui/material";
import { styled } from "@mui/system";


const WidgetWrap=styled(Box)(({theme}) =>({
padding:"1.5rem 1.5rem 0.75rem 1.5rem",
backgroundColor:theme.palette.background.alt,
borderRadious:"0.75rem"
}))

export default WidgetWrap;