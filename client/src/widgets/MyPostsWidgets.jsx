
import { EditOutlined,DeleteOutlineOutlined ,ImageOutlined,AttachFileOutlined,GifBoxOutlined,MicOutlined,MoreHorizOutlined} from "@mui/icons-material"
import { Typography ,Box,useTheme,Button,InputBase,IconButton,useMediaQuery,Divider} from "@mui/material"
import UserWidget from "./UserWidget";
import userImage from "components/UserImage";
import FlexBetween from "components/Flexbetween";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setPosts    } from "state";
import WidgetWrap from "components/WidgetWrap";




const MyPostsWidgets=({picturePath}) =>{
    const dispatch=useDispatch();
    const [isImage,setisImage]=useState(false)
    const[image,setImage]=useState(null);
    const[post,setPost]=useState("");
    const {palette}=useTheme();
    console.log(palette,'palettte')
    const {_id}=useSelector((state)=>state.user)
    const token=useSelector((state)=>state.token)
    const isNonMobileScreen=useMediaQuery('(min-width:1000px)')
    const medium=palette.neutral.medium;
    const mediumMain=palette.neutral.mediumMain;    

    const handlepost=async()=>{
        const formData=new FormData();
        formData.append("userId",_id);
        formData.append("description",post)
        if(image){
            formData.append("picture",image)
            formData.append("picturePath",image.name)
        }
        const response=await fetch(`http://localhost:3001/posts`,{
            method:"post",
            headers:{Authorization:`Beares${token}`},
            body:formData,
        })
        const posts=await response.json();
        dispatch(setPosts({posts}));
        setImage(null)
        setPosts("null");
    }
    

    

  return (
   <WidgetWrap>
    <FlexBetween gap={'1.5rem'}>
    <userImage image={picturePath}></userImage>
        <InputBase placeholder="Whats on your mind..." onChange={(e)=>{setPost(e.target.value)}} value={post}
        sx={{width:"100px" ,backgroundColor:palette.neutral.light,
        borderRadious:"2rem",
        padding:"1rem 2rem",
        }} />
    </FlexBetween>
    {isImage && 
    <Box
    borderRight={"5px"}
    mt={"1rem"}
    p={"1rem"}
    >
                <Dropzone acceptedFiles={".jpg, .jpeg, .png"}
            multiple={false}
            onDrop={(acceptedFiles)=>{setisImage(acceptedFiles[0])}}
          >
          {({getRootProps,getInputProps})=>(
            <FlexBetween>
            <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p={"1rem"} 
             width="100px" sx={{
              "& :hover":{curser:"pointer"}
            }}>
              <input {...getInputProps()}/>
              {!image ?(<p>Add image </p>):
              (
                <FlexBetween>
                  <Typography>{image.name} </Typography>
                  <EditOutlined/>
                </FlexBetween>
              ) }
            </Box>
            {image&& <IconButton onClick={()=>{setImage(null)}} sx={{width:"15%"}}>
                <DeleteOutlineOutlined/>
            </IconButton>}
            </FlexBetween>
          )}
          </Dropzone>
    </Box>}
    <Divider sx={{margin:"1.25rem 0"}}></Divider>
    <FlexBetween>
        <FlexBetween gap={"0.25rem"} onClick={()=>{setisImage(!isImage)}}>
        <ImageOutlined sx={{color:mediumMain}}></ImageOutlined>
        <Typography 
        color={mediumMain} 
        sx={{"$ :hover":{curser:"pointer", color:medium}}}>
            Image
        </Typography>
        </FlexBetween>
                {isNonMobileScreen?( <>
                    <FlexBetween gap={".25rem"}>
                      <GifBoxOutlined color={mediumMain}/>
                      <Typography color={mediumMain}></Typography>
                    </FlexBetween>
                    <FlexBetween gap={".25rem"}>
                      <AttachFileOutlined color={mediumMain}/>
                      <Typography color={mediumMain}>Attach</Typography>
                    </FlexBetween>
                    <FlexBetween gap={".25rem"}>
                      <MicOutlined color={mediumMain}/>
                      <Typography color={mediumMain}>Mic</Typography>
                    </FlexBetween>
                   
                </>):( <FlexBetween gap={"0.25rem"}>
                    <MoreHorizOutlined sx={{color:mediumMain}}></MoreHorizOutlined>
                </FlexBetween>)
               }
               <Button
               disabled={!post}
               onClick={handlepost}
               sx={{color:palette.primary.main}}
               borderRadious="3rem"
               >
                POST
               </Button>
    </FlexBetween>
   </WidgetWrap>
  )
}

export default MyPostsWidgets
