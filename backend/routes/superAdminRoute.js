const express = require("express")
const { loginSuperAdmin } = require("../controllers/superAdmin")
const router=express.Router()
router.post("/login",loginSuperAdmin)
module.exports=router