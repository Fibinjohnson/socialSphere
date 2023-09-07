const express=require('express');
const BodyParser=require('body-parser');
const {register}=require("./controller/auth")
const{editProfile}=require("./controller/auth")
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
app.use("/api/assets", express.static(path.join(__dirname,  "public", "assets")));

global.onlineUsers=new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    console.log('Updated:', onlineUsers);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('receive_data', data.messageData); 
    }
  });
});

console.log(__dirname)

/*STORAGE MULTER*/
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
  

app.post("/api/auth/register",upload.single("picture"),register)
app.patch('/api/auth/edit/:userId',upload.single('picture'),editProfile)
app.post('/api/posts',verifyToken,upload.single("picture"),createPost)
app.use("/api/auth",router)
app.use("/api/users",userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/chats',chatRoutes)

connectToDb()
.then(() => {
  console.log("Connection successful");
  
  
  const port = process.env.PORT || 3001;
  
  server.listen(port, async () => {
    console.log(`App is listening at port ${port}`);
  });
})
.catch((error) => {
  console.error(error, "Error");
});

    

