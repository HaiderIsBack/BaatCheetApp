const Messages = require("../models/Message")
const Conversations = require("../models/Conversation")
const Users = require("../models/User")

const createMessage = async (req, res) => {
  try{
    const {conversationId, senderId,receiverId, message,status, time} = req.body
    if(conversationId == "new" && receiverId){
      const newConversation = new Conversations({ members:[senderId,receiverId]})
      await newConversation.save()
      const newMessage = new Messages({
      conversationId:newConversation._id,
      senderId,
      message,
      status,
      time
    });
    await newMessage.save()
    return res.status(200).send("Message sent successfully")
    }
    const newMessage = new Messages({
      conversationId,
      senderId,
      message,
      status,
      time
    });
    await newMessage.save()
    res.status(200).send("Message created successfully")
  }catch(e){
    console.log(e)
    res.status(500).send("There some problem while creating message")
  }
}

const getMessage = async (req, res) => {
  try{
    const conversationId = req.query.conversationId;
    if(conversationId === undefined){
      const senderId = req.query.senderId
      const receiverId = req.query.receiverId
      const conversation = await Conversations.findOne({$and: [{members: {$in: [senderId]}},{members: {$in: [receiverId]}}]
      })
      if(conversation){
        const convoId = conversation._id
        const messages = await Messages.find({conversationId: convoId})
        const messagesUserData = Promise.all(messages.map(async (message)=>{
        const user = await Users.findById(message.senderId)
        return {user:{id:user._id,name:user.name,username:user.username},message:message.message,time:message.time}
        }))
        return res.status(200).json({messages:await messagesUserData,conversationId:convoId})
      }
      else{
        return res.status(200).json([])
      }
    }
    const receiverId = req.query.receiverId;
    await Messages.updateMany({$and:[{conversationId},{senderId:receiverId},{status:"unread"}]},{status: "read"})
    const messages = await Messages.find({conversationId})
    const messagesUserData = Promise.all(messages.map(async (message)=>{
      const user = await Users.findById(message.senderId)
      return {user:{id:user._id,name:user.name,username:user.username},message:message.message,time:message.time}
    }))
    res.status(200).json(await messagesUserData)
  }catch(e){
    console.log(e)
    res.status(500).send("There was some problem while getting the messages")
  }
}

module.exports = {
  createMessage,
  getMessage
}