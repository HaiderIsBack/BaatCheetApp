const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  image:{
    type:String
  },
  token:{
    type:String
  },
  verifiedUser:{
    type:String
  }
});

const Users = mongoose.model("User",userSchema)

module.exports = Users