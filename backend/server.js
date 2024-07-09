const express = require("express")
const cors = require("cors")
const path = require("path")
const http = require("http")

// Server Starter
const port = process.env.PORT || 8080

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://baat-cheet-app-frontend.vercel.app",
    methods: ["GET","POST"]
  }
})

app.use(cors({
  origin: "https://baat-cheet-app-frontend.vercel.app"
}))
// cors: {
//   origin: process.env.CLIENT_URL || "*"
// }
require("dotenv").config()

//DB
require("./db/connectdb")

//Custom Middlewares
const verifyToken = require("./Middleware/VerifyToken")

//Models
const Messages = require("./models/Message")
const Users = require("./models/User")

//Routes
const users = require("./routes/User")
const conversations = require("./routes/Conversation")
const messages = require("./routes/Message")

//Middlewares
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Socket IO
var activeUsers = []
io.on("connection", socket => {
  socket.on("addUser", userId => {
    const userExists = activeUsers.find((user) => user.userId === userId)
    if(!userExists){
      socket.userId = userId
      activeUsers.push({
        userId: userId,
        socketId: socket.id
      })
      io.emit("getUsers", activeUsers)
    }
  })
  socket.on("sendMessage",async ({conversationId,senderId,receiverId,message,time})=>{
    const receiver = activeUsers.find((user)=> user.userId === receiverId)
    const sender = activeUsers.find((user)=> user.userId === senderId)
    const user = await Users.findById(senderId)
    const newMessage = new Messages({
        conversationId,
        senderId,
        receiverId,
        message,
        status: "unread",
        time,
        user: {id: user._id,name: user.name,username: user.username}
      })
    if(receiver){
      const unReadMsgs = await Messages.find({$and:[{conversationId:conversationId},{senderId:receiver.userId},{status:"unread"}]}).count();
      await Messages.updateMany({$and:[{conversationId},{senderId:receiver.userId},{status:"unread"}]},{status: "read"});
      io.to(receiver.socketId).emit("getMessage", newMessage)
      io.to(receiver.socketId).emit("recievedMessage",unReadMsgs)
    }
    io.to(sender.socketId).emit("getMessage",newMessage)
  })
  socket.on("disconnect", ()=>{
    activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id)
    io.emit("getUsers", activeUsers)
  })
})

// Utilizing the defined Routes
app.use("/api/v1",users)
app.use("/api/v1",conversations)
app.use("/api/v1",messages)

//Upload Image Route Custom
const multer = require("multer")
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname+'/public/uploads/')
    },
    filename:async (req, file, cb) => {
        const user = await Users.findOne({
          _id: req.body.userId
        });
        
        const ext = file.mimetype.split("/")[1]
        cb(null, file.fieldname + '-' + Date.now()+"."+ext)
    },
    size: (req, file, cb) => {
      if(file.size / 1024 > 2 * 1024){
        cb(null, false)
      }else{
        cb(null, file.size)
      }
    }
});
var upload = multer({ storage: storage });

app.post('/api/v1/upload_image',verifyToken ,upload.single('image'), async (req, res, next) => {
    await Users.updateOne({_id:req.body.userId},{
      $set: {image: process.env.URL+__dirname+"/uploads/"+req.file.filename}
    })
    // KBs
    if(req.file.size / 1024 > 2 * 1024){
      return res.status(400).json({msg:"File is too large!"})
    }
    res.status(200).json({image:process.env.URL+__dirname+"/uploads/"+req.file.filename})
});


server.listen(port, ()=> console.log(`Server Started on Port : ${port}`));
// server.listen(port,console.log("Socket Server Started on 3000"));
