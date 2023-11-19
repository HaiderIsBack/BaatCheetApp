const Users = require("../models/User")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

//Login
const getUser = async (req, res, next) => {
  try {
    const {username, password} = req.body
    if(!username || !password){
      res.status(400).json({msg:"please fill out data first"})
    }else{
      const user = await Users.findOne({username:username})
      if(!user){
        res.status(400).json({msg:"User with this username does not exist"})
      }else{
        const validateUser = await bcryptjs.compare(password, user.password)
        console.log(validateUser)
        if(!validateUser){
          res.status(400).json({msg:"User's password is incorrect"})
        }else{
          const payload = {
            userId: user._id,
            username: user.username
          }
          const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "This_Is_JWT_App_Secret_@#£_"
          jwt.sign(payload,JWT_SECRET_KEY,{expiresIn: 84600 * 2},async (err, token)=>{
            await Users.updateOne({_id:user._id},{
              $set: {token:token}
            })
            user.save()
            return res.status(200).json({
            user:{
              userId:user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              image: user.image
            },token: user.token
          })
          })
        }
      }
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({msg:"There was some problem while authenticating the user"})
  }
}

//Sign Up
const createUser = async (req, res, next) => {
  try{
    const {name, email, username, password} = req.body;
    if(!name || !email || !username || !password){
      res.status(400).json({msg:"please fill credentials first"})
    }else{
      const isAlreadyExist = await Users.findOne({username});
      if(isAlreadyExist){
        res.status(400).json({msg:"User with this username already exists"})
      }else{
        const newUser = new Users({
          name: name,
          email: email,
          username: username
        })
        bcryptjs.hash(password, 10, (err, hashedPassword)=>{
          newUser.set('password',hashedPassword)
          newUser.save()
        })
        return res.status(200).json({msg:"User created successfully"});
      }
    }
  }catch(e){
    console.log(e);
    res.status(500).send("There was some problem while creating the user")
  }
}

const getUsers = async (req, res) => {
  try {
    const query = req.params.query
    const allUsers = await Users.find()
    const users = Promise.all(allUsers.map(user => {
      if(user.username.includes(query)){
        return {id:user._id,name:user.name,username:user.username,verified:user.verified};
      }
    }).filter(user => user))
    res.status(200).json(await users)
  } catch (e) {
    console.log(e)
    res.status(500).send("There was some problem with request")
  }
}

module.exports = {
  getUser,
  getUsers,
  createUser
}