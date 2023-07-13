import { Widgets } from "@mui/icons-material";
import { Typography,useTheme } from "@mui/material"
import FlexBetween from "components/Flexbetween"
import WidgetWrap from "components/WidgetWrap"


function AdvertWidget() {
    const {palette}=useTheme();
    const dark=palette.neutral.dark
    const main=palette.neutral.main
    const medium=palette.neutral.medium
  return (
   <WidgetWrap>
    <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight={"500"}>
           sponsered
        </Typography>
        <Typography color={medium}>
           create Add
        </Typography>
    </FlexBetween>
    <img width={"100%"} height="auto" alt="Advert" src="https://localhost:3000/assets/info4.jpeg"
        style={{borderRadius:"0.75rem",margin:"0.75rem,0"}}
    />
    <FlexBetween>
        <Typography color={main}>mikaCosmetics</Typography>
        <Typography color={medium}>cosmetics.com</Typography>

    </FlexBetween>
    <Typography color={medium} m={"0.5rem 0"}>Rndom desccriptin about the advertising product</Typography>
   </WidgetWrap>
  )
}

export default AdvertWidget
