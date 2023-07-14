const express=require('express');
const BodyParser=require('body-parser');
const {register}=require("./controller/auth")
const {createPost}=require("./controller/posts")
const{verifyToken}=require("./middleware/auth")
const userRoutes=require("./routes/userRoutes")
const postRoutes=require("./routes/postRoutes")
const router=require("./routes/auth")
require("dotenv").config();
const helmet=require("helmet");
const morgan=require("morgan");
const multer=require("multer")
const path=require("path");
const cors=require('cors');
const cookieParser=require("cookie-parser");
const{connectToDb}=require("./connection/connection")


const app =express();
app.use(cookieParser())
app.use(express.json());
app.use(BodyParser.json({ limit:"30mb",extended:true}))
app.use(morgan("common"))
app.use(helmet.crossOriginResourcePolicy({
    policy:"cross-origin"
}));
app.use(BodyParser.urlencoded({limit:"30mb", extended: true }));


app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));


/*STORAGE CONFIGIRATION*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname, "public/assets"))
    },
    filename: function (req, file, cb) {
      
      console.log(file,"file")
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
  

app.post("/auth/register",upload.single("picture"),register)
app.post('/posts',verifyToken,upload.single("picture"),createPost)
app.use("/auth",router)
app.use("/users",userRoutes)
app.use('/posts',postRoutes)
app.get("/auth/register",(req,res)=>{res.send("hello page is working")})











   connectToDb().then(()=>{console.log("connection successfull")
    app.listen(3001||process.env.PORT,async()=>{
     
      console.log("app is listening at port 3001")})
    
   }).catch((error)=>{
    console.log(error,":error")
   })
    

