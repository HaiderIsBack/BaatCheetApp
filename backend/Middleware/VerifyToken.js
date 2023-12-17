const Users = require("../models/User")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const verifyToken = async (req, res, next) => {
  const userToken = req.headers.authorization;
  const user = await Users.findOne({token: userToken});
  if(!user){
    return res.status(440).send("Invalid Token Passed!")
  }else{
    try{
      jwt.verify(userToken, process.env.JWT_SECRET_KEY)
      next()
    }catch(e){
      return res.status(440).send("Token  Expired")
    }
  }
}

module.exports = verifyToken