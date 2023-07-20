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
const http=require('http');
const { Server } = require("socket.io");



const app =express();
app.use(cors({  origin: 'http://localhost:3000'}))
const server=http.createServer(app)
const io = new Server(server);
app.use(cookieParser())
app.use(express.json());
app.use(BodyParser.json({ limit:"30mb",extended:true}))
app.use(morgan("common"))
app.use(helmet.crossOriginResourcePolicy({
    policy:"cross-origin"
}));
app.use(BodyParser.urlencoded({limit:"30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));


io.on('connection', (socket) => {
  console.log('A user connected in ',socket.id);
  socket.on("join_room",(data)=>
  {socket.join(data);
  console.log("printed data in server:",data)})

  socket.on('disconnect', () => {
    console.log('A user disconnected',socket.id);
  });
});


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


   connectToDb().then(()=>{console.log("connection successfull")
    server.listen(3001||process.env.PORT,async()=>{
     
      console.log("app is listening at port 3001")})
    
   }).catch((error)=>{
    console.log(error,":error")
   })
    

