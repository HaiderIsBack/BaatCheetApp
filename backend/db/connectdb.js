const mongoose = require("mongoose")

const uri = "mongodb+srv://haidershah:ArkhamKnight1342@cluster0.h2d6ilo.mongodb.net/?retryWrites=true&w=majority";

const connect = () => {
  try {
    mongoose.connect(uri)
    console.log("Database Connected...")
  } catch (e) {
    console.log(e)
  }
}
connect()
