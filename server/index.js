const express=require('express');
const BodyParser=require('body-parser');
const {register}=require("./controller/auth")
const {createPost}=require("./controller/posts")
const{verifyToken}=require("./middleware/auth")
const authRoutes=require("./routes/auth")
const userRoutes=require("./routes/userRoutes")
const postRoutes=require("./routes/postRoutes")
require("dotenv").config();
const helmet=require("helmet");
const morgan=require("morgan");
const multer=require("multer");
const path=require("path");
const cors=require('cors');
const {fileURLToPath}=require("url");
const cookieParser=require("cookie-parser");
const{connectToDb}=require("./connection/connection")

const app =express();
app.use(cookieParser())
app.use(express.json());
app.use(BodyParser.json());
app.use(morgan("common"))
app.use(helmet.crossOriginResourcePolicy({
    policy:"cross-origin"
}));
app.use(BodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));


/*STORAGE CONFIGIRATION*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

app.post("/auth/register",register,upload.single("picture"))
app.post('/posts',verifyToken,upload.single("picture"),createPost)
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use('/posts',postRoutes)
app.get("/auth/register",(req,res)=>{res.send("hello page is working")})











   connectToDb().then(()=>{console.log("connection successfull")
    app.listen(3001||process.env.PORT,()=>{console.log("app is listening at port 3001")})
   }).catch((error)=>{
    console.log(error,":error")
   })
    

