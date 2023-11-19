const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  }
})

const Images = mongoose.model("Image",imageSchema)

module.exports = Images