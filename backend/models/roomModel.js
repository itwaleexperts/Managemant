const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel", 
    required: true,
  },
  roomNumber: {
    type: String,
    required: [true, "enter room number"],
    trim: true,
    unique: true,
  },
  roomType: {
    type: String,
    required: [true, "enter room type"],
    trim: true,
  },
  roomStatus: {
    type: String,
    required: [true, "enter room status"],
    default: "available",
  },
  pricePerNight: {
    type: Number,
    required: [true, "enter room pricePerNight"],
  },
  floorNumber: { type: Number, default: null },
  capacity: {
    type: Number,
    required: [true, "enter room capacity"],
    default: 1,
  },
  isSmoking: { type: Boolean, default: false },
  amenities: { type: [String], default: [] },
  isWindow: { type: Boolean, default: false },
  images:[{type:String}],

  number : {
    type : Number,
  } , 
  email : {
    type : String
  } , 
  about : {
    type : String
  }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
























































