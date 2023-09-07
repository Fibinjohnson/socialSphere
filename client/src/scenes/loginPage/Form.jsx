import {useState} from 'react'
import {Box,Button,TextField,useMediaQuery,Typography,useTheme} from "@mui/material"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik'
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/Flexbetween';
import config from '../../config'

 const registerScema=yup.object().shape({
  firstname:yup.string().required("required"),
  lastname:yup.string().required("required"),
  email:yup.string().email("invalid Email").required("required"),
  password:yup.string().required("required"),
  location:yup.string().required("required"),
  occupation:yup.string().required("required"),
  picture:yup.string().required("required")
 })
 const loginSchema=yup.object().shape({
  email:yup.string().email("invalid Email").required("required"),
  password:yup.string().required("required")
 })
 const initialValueRegister={
  firstname:"",
  lastname:"",
  email:"",
  password:"",
  location:"",
  occupation:"",
  picture:""
 }

 const initialvalueLogin={
  email:"",
  password:""
 }
function Form() {
  const [pageType,setPageType]=useState('login');
  const {palette}=useTheme();
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const isNonMobileScreen=useMediaQuery("(min-width:600px)")
  const isLogin=pageType==="login";
  const isRegister=pageType==="register";

  const handleSubmit=async(values,onSubmitProps)=>{
    {isLogin &&await login(values,onSubmitProps)};
    {isRegister && await register(values,onSubmitProps)}
  }

  const register=async(values,onSubmitProps)=>{
    
   let formData=new FormData();
   for (let value in values){
   
   formData.append(value,values[value])
   
   }
   
   formData.append("picture",values.picture.name)
  const savedUserResponse = await fetch(`${config.API_SERVER}/auth/register`, {
    method: "POST",
    body: formData
  });
   const savedUser=await savedUserResponse.json();
   onSubmitProps.resetForm(); 
   if(savedUser){
    setPageType("login")
   }
  }


  const login=async(values,onSubmitProps)=>{
    const loggedInResponse=await fetch(`${config.API_SERVER}/auth/login`,
   {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(values)
   });
   const loggedIn=await loggedInResponse.json();
   onSubmitProps.resetForm();
   if(loggedIn){
    dispatch(
      setLogin({
        user:loggedIn.user,
        token:loggedIn.token
      })
    )
    navigate("/home")
   }}

  return (
    <Formik
    onSubmit={handleSubmit}
    initialValues={isLogin? initialvalueLogin:initialValueRegister}
    validationSchema={isLogin? loginSchema :registerScema}>
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
        <Box display={"grid"} gap="30px" gridTemplateColumns={'repeat(4,minxmax(0,1fr))'} sx={{"& >div":{gridColumn:isNonMobileScreen?undefined:"span 4"}}}>
        {isRegister && (<>
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
             <TextField label={"occupation"} 
          onBlur={handleBlur} 
          onChange={handleChange}
          value={values.occupation} 
          name='occupation'
          error={Boolean(touched.occupation) && Boolean(errors.occupation)}
          helperText={touched.occupation && errors.occupation}
          sx={{gridColumn:"span 2"}}
          />
             <TextField label={"Location"} 
          onBlur={handleBlur} 
          onChange={handleChange}
          value={values.location} 
          name='location'
          error={Boolean(touched.location) && Boolean(errors.location)}
          helperText={touched.location && errors.location}
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
              {!values.picture ?(<p>Add picture here</p>):
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
          

        </>)}
        <TextField label={"Email"} 
          onBlur={handleBlur} 
          onChange={handleChange}
          value={values.email} 
          name='email'
          error={Boolean(touched.email) && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          sx={{gridColumn:"span 2"}}
          />
             <TextField label={"Password"} 
          onBlur={handleBlur} 
          onChange={handleChange}
          value={values.password} 
          name='password'
          error={Boolean(touched.password) && Boolean(errors.password)}
          helperText={touched.password && errors.password}
          sx={{gridColumn:"span 2"}}
          />
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
            {isLogin?"Login":"Register"}
           </Button>
           <Typography onClick={()=>{setPageType(isLogin?"register":"login"); console.log("clicked");
           resetForm()}}
           sx={{
            textDecoration:"underlline",
            color:palette.primary.main,
            "& :hover":{cursor:"pointer",color:palette.primary.light}
           }}>{isLogin?"Dont Have an account?..Register here":"Click here to login"} </Typography>
        </Box>
      </form>
    )
    }
    </Formik>
  ) 
}

export default Form
