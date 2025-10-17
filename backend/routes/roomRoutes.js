const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room");
const uploadImagesMiddleware = require("../middlewares/uploadImageMiddleware.js");

router.post("/:hotelId", uploadImagesMiddleware, roomController.createRoom);

router.get("/", roomController.getAllRooms);

router.get("/:id", roomController.getRoomById);

router.put("/:id", uploadImagesMiddleware, roomController.updateRoom);

router.delete("/:id", roomController.deleteRoom);

router.get("/hotel/:hotelId", roomController.getRoomsByHotel);

module.exports = router;