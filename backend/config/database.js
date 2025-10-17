const mongoose = require("mongoose")

function dataBaseConnection(){
  try {
    const mongodbConnectionString = process.env.MONGO_URI
    mongoose.connect(mongodbConnectionString)
    console.log("dataBase Connection successfull!")
  } catch (error) {
    console.log("dataBaseConnection error is ==================>",error)
  }
}

module.exports=dataBaseConnection