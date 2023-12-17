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
      const user = await Users.findOne({$or:[{username:username},{email: username}]})
      if(!user){
        res.status(400).json({msg:"User with this username does not exist"})
      }else{
        const validateUser = await bcryptjs.compare(password, user.password)
        if(!validateUser){
          res.status(400).json({msg:"User's password is incorrect"})
        }else{
          const payload = {
            userId: user._id,
            username: user.username
          }
          const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "This_Is_JWT_App_Secret_@#£_"
          jwt.sign(payload,JWT_SECRET_KEY,{expiresIn: 86400 * 2},async (err, token)=>{
            await Users.updateOne({_id:user._id},{
              $set: {token:token}
            })
            user.save()
            const updatedUser = await Users.findOne({_id: user._id})
            return res.status(200).json({
            user:{
              userId:user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              verified: user.verifiedUser,
              image: user.image
            },token: updatedUser.token
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

//All Users
const getUsers = async (req, res) => {
  try {
    const query = req.params.query
    const allUsers = await Users.find().limit(10)
    const users = Promise.all(allUsers.map(user => {
      if(user.username.includes(query)){
        return {id:user._id,name:user.name,username:user.username,verified:user.verifiedUser,image:user.image};
      }
    }).filter(user => user))
    res.status(200).json(await users)
  } catch (e) {
    console.log(e)
    res.status(500).send("There was some problem with request")
  }
}

//Update User
const updateUser = async (req, res) => {
  const {
    userId,
    name,
    username,
    email
  } = req.body;
  //Checking if the requesting user gives all required data
  if(!userId || !name || !username || !email){
    return res.status(400).send("Please give data")
  }else{
    //Getting the requesting user
    const currUser = await Users.findOne({
      _id: userId
    });
    //Checking if changings conflict with other users
    const userMatches = await Users.find({
      $and: [
        {$or: [
          {username: username},
          {email: email}
        ]},
        //Except myself
        {_id: {
          $ne: userId
        }}
      ]
    });
    if(userMatches.length > 0){
      return res.status(400).json({msg:"Conflicting other users"})
    }else{
      //Updating the User
      const userUpdated = await Users.findOneAndUpdate({
        _id: userId
      },{
        name: name,
        username: username,
        email: email
      });
      //Returning Updated User
      return res.status(200).json({
        name: name,
        username: username,
        email: email
      })
    }
  }
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser
}