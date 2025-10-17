const express = require("express")
const router=express.Router()
const {report} = require("../controllers/reports")
router.get("/get",report)
module.exports=router