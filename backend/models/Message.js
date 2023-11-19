const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
  conversationId:{
    type: String,
    required: true
  },
  senderId:{
    type:String
  },
  message:{
    type:String
  },
  time:{
    type:Number
  },
  user: {
    type: Object
  }
})

const Messages = mongoose.model("Message", messageSchema)

module.exports = Messages