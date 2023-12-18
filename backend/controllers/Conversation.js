const Users = require("../models/User")
const Conversations = require("../models/Conversation")
const Messages = require("../models/Message")


const createConversation = async (req, res) => {
  try {
    const {senderId, receiverId} = req.body
    if(!senderId || !receiverId){
      res.status(400).send("Please send sender and reciever id")
    }else{
      const doesExist = await Conversations.find({members:{$in:[receiverId]}})
      return res.status(200).json(doesExist)
      const newConversation = new Conversations({ members:[senderId,receiverId]})
      await newConversation.save()
      res.status(200).json(newConversation)
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("There was some problem while creating conversation")
  }
}

const getConversation = async (req, res) => {
  try {
    const userId = req.params.userId
    const conversations = await Conversations.find({ members:{
      $in: [userId]
    }})
    const conversationUserData = Promise.all(conversations.map(async (conversation)=>{
      const recieverId = conversation.members.find((member) => member !== userId)
      const user = await Users.findById(recieverId)
      
      const unReadMsgs = await Messages.find({$and:[{conversationId:conversation._id.toHexString()},{senderId:recieverId},{status:"unread"}]}).count();
      return {user:{id:user._id,name:user.name,verified:user.verifiedUser,email:user.email,username:user.username,image:user.image},unReadMsgs: unReadMsgs,conversationId: conversation._id}
    }))
    
    res.status(200).json(await conversationUserData)
  } catch (e) {
    console.log(e)
    res.status(500).send("There was some problem while getting conversation")
  }
}

const deleteConversation = async (req, res) => {
  try{
    const conversationId = req.params.convoId;
    await Messages.deleteMany({
    conversationId: conversationId
    });
    const response = await Conversations.deleteOne({
    _id: conversationId
    });
    return res.status(200).json(response);
  }catch(e){
    console.log(e)
    res.status(500).send("Error Occured!")
  }
}

module.exports = {
  createConversation,
  getConversation,
  deleteConversation
}