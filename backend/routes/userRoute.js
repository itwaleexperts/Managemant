const express = require("express")
const { registerUser, loginUser, userDetails, updateUser } = require("../controllers/user")
const verifyUserToken = require("../middlewares/verifyUserMiddleware")
const router=express.Router()
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/single",verifyUserToken,userDetails)
router.put("/update",verifyUserToken,updateUser)
module.exports=router