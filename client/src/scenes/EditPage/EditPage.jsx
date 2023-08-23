
import {Box,Button,TextField,useMediaQuery,Typography,useTheme} from "@mui/material"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/Flexbetween';
import { setEditeduser } from 'state';


   function EditPage() {
    const {palette}=useTheme();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const isNonMobileScreen=useMediaQuery("(min-width:600px)")
    const {userId}=useParams();
    const user=useSelector((state)=>state.user)
    const editSchema=yup.object().shape({
        firstname:yup.string().required("required"),
        lastname:yup.string().required("required"),
        picture:yup.string().required("required")
       })
    
       const initialEditValue={
        firstname:user.firstname,
        lastname:user.lastname,
        picture:''
       }
    
   

     const handleSubmit=async(values,onSubmitProps)=>{
        let formData=new FormData();
        for (let value in values){
        formData.append(value,values[value])
        }
        formData.append("picture",values.picture.name)
        const editUserResponse = await fetch(`http://localhost:3001/auth/edit/${userId}`, {
        method: "PATCH",
        body: formData
  });
   const editedProfile=await editUserResponse.json();
   dispatch(setEditeduser({user:editedProfile}))
   onSubmitProps.resetForm(); 
   navigate('/home')
     }


     return (
       <Formik onSubmit={handleSubmit}
       initialValues={initialEditValue}
       validationSchema={editSchema}>
       {({
      values,
      errors,
      touched,
      handleSubmit,
      handleChange,
      handleBlur,
      setFieldValue,
      resetForm

    })=>(
        <form onSubmit={handleSubmit}>
        <Box display={"grid"} gap="30px" marginTop={'10%'} gridTemplateColumns={'repeat(4,minxmax(0,1fr))'} sx={{"& >div":{gridColumn:isNonMobileScreen?undefined:"span 4"}}}>
        <TextField label={"First Name"}
          onBlur={handleBlur} 
          onChange={handleChange}
          value={values.firstname} 
          name='firstname'
          error={Boolean(touched.firstname) && Boolean(errors.firstname)}
          helperText={touched.firstname && errors.firstname}
          sx={{gridColumn:"span 2"}}
          >
          </TextField>
          <TextField label={"Last Name"} 
          onBlur={handleBlur} 
          onChange={handleChange}
          value={values.lastname} 
          name='lastname'
          error={Boolean(touched.lastname) && Boolean(errors.lastname)}
          helperText={touched.lastname && errors.lastname}
          sx={{gridColumn:"span 2"}}
          />
          <Box gridColumn={'span 4'} border={`1px solid ${palette.neutral.medium}`} borderRadious="5px" p="1rem">
          <Dropzone acceptedFiles={".jpg, .jpeg, .png"}
            multiple={false}
            onDrop={(acceptedFiles)=>{
             
              setFieldValue("picture",acceptedFiles[0])}}
          >
          {({getRootProps,getInputProps})=>(
            <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p={"1rem"} sx={{
              "& :hover":{curser:"pointer"}
            }}>
              <input {...getInputProps()}/>
              {!values.picture ?(<p>Add New profile picture here</p>):
              (
                <FlexBetween>
                  <Typography>{values.picture.name} </Typography>
                  <EditOutlinedIcon/>
                </FlexBetween>
              ) }
            </Box>
          )}
          </Dropzone>

          </Box>
        </Box>
        <Box>
          <Button type='submit' 
          fullWidth 
          sx={{m:"2rem 0",
           p:"1rem",
           backgroundColor:palette.primary.main,
           color:palette.background.alt,
           "& :hover":{color:palette.primary.main}}}
           > 
           Proceed Changes
           </Button>
        </Box>

        </form>
    )}
        
       </Formik>
     )
   }
   
   export default EditPage
   