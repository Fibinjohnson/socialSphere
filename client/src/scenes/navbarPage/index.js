import { useState } from "react";
import {Box,IconButton,InputBase,Typography,Select,MenuItem,FormControl,useTheme,useMediaQuery} from "@mui/material";
import {Search,LightMode,DarkMode,Notifications,Menu,Close,Message} from "@mui/icons-material";
import { Home } from "@mui/icons-material";
import FlexBetween from "components/Flexbetween";
import { useDispatch,useSelector } from "react-redux";
import { setMode,setLogout } from "state";
import { useNavigate } from "react-router-dom";
import config from '../../config'
const NavPage=()=>{
    const [isMobileMenuToggled,setIsMobileMenuToggled]=useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const theme=useTheme();
    const token=useSelector((state)=>state.token)
    const neutralLight=theme.palette.neutral.light;
    const dark=theme.palette.neutral.dark;
    const background=theme.palette.background.default;
    const primaryLight=theme.palette.primary.light;
    const alt=theme.palette.primary.alt;
    const user=useSelector((state)=>state.user);
    const [searchValue,setSearchValue]=useState('')
    const fullname=`${user.firstname} ${user.lastname}`
    const isNonMobileScreen=useMediaQuery("(min-width:1000px)")
    const userId=useSelector((state)=>state.user._id)
    const [searchResult,setSearchResult]=useState()

    const handleSearch=async()=>{
      const url = new URL(`${config.API_SERVER}/users/${userId}/search`);
          url.searchParams.append('q', searchValue);
          try{
            const response=await fetch(url,{
              method:'GET',
              headers:{Authorization:`Bearer ${token}`}
            })
           const data=await response.json()
           setSearchValue('');
           setSearchResult(data)

          }catch(err){
             console.log('somthing error occured')
          }

    }
  

    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
          <FlexBetween gap="1.75rem">
            <Typography
              fontWeight="bold"
              fontSize="clamp(1rem, 2rem, 2.25rem)"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
                SocialSphere 
            </Typography>
            {isNonMobileScreen && (
              <>
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                gap="3rem"
                padding="0.1rem 1.5rem"
              >
              <FlexBetween>
                <InputBase placeholder="Search..." onChange={(e)=>{setSearchValue(e.target.value)}} value={searchValue}/>
                <IconButton>
                  <Search onClick={handleSearch}/>
                </IconButton>  
                </FlexBetween>
              </FlexBetween>
              <div style={{display:'flex',flexDirection:'column'}}>
              {
               searchResult && searchResult.map((friends)=>{
                return <div onClick={()=>{navigate(`/profile/${friends._id}`)}} style={{padding:'3px', cursor:'pointer'}} key={friends._id} >{`${friends.firstname}  ${friends.lastname}`}</div>
               }) 
              }
              </div>
              </>
              
            )}
         
          </FlexBetween>
          
          {/* DESKTOP NAV */}
          {isNonMobileScreen ? (
            <FlexBetween gap="2rem">
              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>
              <Message  onClick={()=>{navigate('/home/chat');}} sx={{ fontSize: "25px" }} />
              <Notifications sx={{ fontSize: "25px" }} />
              <Home onClick={()=>navigate("/home")} sx={{ fontSize: "25px" }} />
              <FormControl variant="standard" value={fullname}>
                <Select
                  value={fullname}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullname}>
                    <Typography>{fullname}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          ) : (
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Menu />
            </IconButton>
          )}
    
          {/* MOBILE NAV */}
          {!isNonMobileScreen && isMobileMenuToggled && (
            <Box
              position="fixed"
              right="0"
              bottom="0"
              height="100%"
              zIndex="10"
              maxWidth="500px"
              minWidth="300px"
              backgroundColor={background}
            >
              {/* CLOSE ICON */}
              <Box display="flex" justifyContent="flex-end" p="1rem">
                <IconButton
                  onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                  <Close />
                </IconButton>
              </Box>
    
              {/* MENU ITEMS */}
              <FlexBetween
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="3rem"
              >
                <IconButton
                  onClick={() => dispatch(setMode())}
                  sx={{ fontSize: "25px" }}
                >
                  {theme.palette.mode === "dark" ? (
                    <DarkMode sx={{ fontSize: "25px" }} />
                  ) : (
                    <LightMode sx={{ color: dark, fontSize: "25px" }} />
                  )}
                </IconButton>
                <Message onClick={()=>{navigate('/home/chat');}} sx={{ fontSize: "25px" }} />
                <Notifications sx={{ fontSize: "25px" }} />
                <Home onClick={()=>{navigate("/home")}} sx={{ fontSize: "25px" }} />
                <FormControl variant="standard" value={fullname}>
                  <Select
                    value={fullname}
                    sx={{
                      backgroundColor: neutralLight,
                      width: "150px",
                      borderRadius: "0.25rem",
                      p: "0.25rem 1rem",
                      "& .MuiSvgIcon-root": {
                        pr: "0.25rem",
                        width: "3rem",
                      },
                      "& .MuiSelect-select:focus": {
                        backgroundColor: neutralLight,
                      },
                    }}
                    input={<InputBase />}
                  >
                    <MenuItem value={fullname}>
                      <Typography>{fullname}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}>
                      Log Out
                    </MenuItem>
                  </Select>
                </FormControl>
              </FlexBetween>
            </Box>
          )}
        </FlexBetween>
      );
}
export default NavPage;
//tuturial of kubernetics