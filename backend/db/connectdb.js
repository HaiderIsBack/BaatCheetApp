const mongoose = require("mongoose")
require("dotenv").config();

const uri = process.env.MONGO_URI;

const connect = () => {
  try {
    mongoose.connect(uri)
    console.log("Database Connected...")
  } catch (e) {
    console.log(e)
  }
}
connect()
