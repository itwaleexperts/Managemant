const express = require("express");
const { createCart, getCart, removeCart, updateCart, clearCart } = require("../controllers/cart");
const verifyUserToken = require("../middlewares/verifyUserMiddleware");
const router = express.Router();


router.post("/create", verifyUserToken, createCart);
router.get("/get", verifyUserToken, getCart);
router.post("/remove", verifyUserToken, removeCart); 
router.post("/update", verifyUserToken, updateCart);
router.delete("/clear", verifyUserToken, clearCart); 


module.exports = router;