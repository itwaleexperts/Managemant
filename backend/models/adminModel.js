const mongoose=require("mongoose")
const adminSchema=new mongoose.Schema({
  name:{type:String,required:[true,"enter your name"]},
  email:{type:String,required:[true,"enter your email"]},
  password:{type:String,required:[true,"enter your passowrd"]},
  createHotel : {type:mongoose.Types.ObjectId,ref:"Hotel"},
  createRoom:{type:mongoose.Types.ObjectId,ref:"Room"}
},{timestamps:true})

const Admin=mongoose.model("Admin",adminSchema)
module.exports=Admin