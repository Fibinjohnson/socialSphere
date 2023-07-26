const express=require('express');
const BodyParser=require('body-parser');
const {register}=require("./controller/auth")
const {createPost}=require("./controller/posts")
const{verifyToken}=require("./middleware/auth")
const userRoutes=require("./routes/userRoutes")
const postRoutes=require("./routes/postRoutes")
const router=require("./routes/auth")
const chatRoutes=require('./routes/chatRoutes')
require("dotenv").config();
const helmet=require("helmet");
const morgan=require("morgan");
const multer=require("multer")
const path=require("path");
const cors=require('cors');
const cookieParser=require("cookie-parser");
const{connectToDb}=require("./connection/connection")
const app =express();
const http=require('http');
const { Server } = require("socket.io");
const server=http.createServer(app)
const io = new Server(server);

app.use(cors({  origin: 'http://localhost:3000',
     credentials:true}))
app.use(cookieParser())
app.use(express.json());
app.use(BodyParser.json({ limit:"30mb",extended:true}))
app.use(morgan("common"))
app.use(helmet.crossOriginResourcePolicy({
    policy:"cross-origin"
}));
app.use(BodyParser.urlencoded({limit:"30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));

global.onlineUsers=new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    console.log('Updated:', onlineUsers);
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(sendUserSocket, 'send usersocket');
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('receive_data', data.messageData); 
    }
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
app.use('/chats',chatRoutes)


   connectToDb().then(()=>{console.log("connection successfull")
    server.listen(3001||process.env.PORT,async()=>{
     
      console.log("app is listening at port 3001")})
    
   }).catch((error)=>{
    console.log(error,":error")
   })
    

