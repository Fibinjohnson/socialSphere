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
    <img
  width={"100%"}
  height="auto"
  alt="Advert"
  src={'http://localhost:3001/assets/advertisement.jpg'}
  style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
/>

    <FlexBetween>
    
        <Typography color={main}>Pulser 250 ns</Typography>
        <Typography color={medium}>Bajaj.com</Typography>

    </FlexBetween>
    <Typography color={medium} m={"0.5rem 0"}>249.07cc, Oil-Cooled, 4 Stroke, SOHC, 2 Valve, Fuel Injection, Single Cylinder Engine</Typography>
   </WidgetWrap>
  )
}

export default AdvertWidget
