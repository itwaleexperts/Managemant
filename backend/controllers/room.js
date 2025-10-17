const Room = require("../models/roomModel.js");


exports.createRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;

    let imageFilenames = [];
    if (req.files && req.files.length > 0) {
      imageFilenames = req.files.map((file) => file.filename);
    }

    const roomData = {
      ...req.body,
      hotelId,
      images: imageFilenames, 
    };

    const room = new Room(roomData);
    await room.save();

    const populatedRoom = await room.populate("hotelId", "name location");

    res.status(201).json({ message: "Room created successfully!", data: populatedRoom });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hotelId", "name location images");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotelId", "name location");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Room ID format" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => file.filename);
    }

    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (err) {
        console.error("Invalid existingImages format", err);
      }
    }

    const roomData = {
      ...req.body,
      images: [...existingImages, ...newImages], 
    };

    const room = await Room.findByIdAndUpdate(req.params.id, roomData, {
      new: true,
      runValidators: true,
    }).populate("hotelId", "name location");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room updated successfully!", data: room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const rooms = await Room.find({ hotelId }).populate("hotelId", "name location");

    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found for this hotel" });
    }

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};