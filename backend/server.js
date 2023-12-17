const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:5173"
  }
})
require("dotenv").config()

//Express App
const app = express()

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
app.use(cors({
  origin: "http://localhost:5173"
}))
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
        time,
        user: {id: user._id,name: user.name,username: user.username}
      })
    if(receiver){
      io.to(receiver.socketId).emit("getMessage", newMessage)
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
        cb(null, 'public/uploads/')
    },
    filename:async (req, file, cb) => {
        const user = await Users.findOne({
          _id: req.body.userId
        });
        if(user.image !== undefined){
          const userPrevImage = user.image.split("/uploads/")[1]
          try{
            fs.unlinkSync(__dirname+"/public/uploads/"+userPrevImage)
          }catch(e){
          console.log(e)
          }
        }
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
      $set: {image: process.env.URL+"/uploads/"+req.file.filename}
    })
    // KBs
    if(req.file.size / 1024 > 2 * 1024){
      return res.status(400).json({msg:"File is too large!"})
    }
    res.status(200).json({image:process.env.URL+"/uploads/"+req.file.filename})
});

// Server Starter
const port = process.env.PORT || 8080
app.listen(port,()=>{
  console.log(`Server Started on Port : ${port}`)
})