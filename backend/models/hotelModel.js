const mongoose = require("mongoose")

const hotelSchema = new mongoose.Schema({
 name: { type: String, required: [true, "Hotel name is required"], trim: true },
  description: { type: String, required: [true, "Hotel description is required"], trim: true },

 // 📍 Added Latitude and Longitude for Map
 latitude: { type: Number, default: null },
 longitude: { type: Number, default: null },
 // ------------------------------------

 location: [{
    address: { type: String, required: [true, "Hotel address info is required"], trim: true },
    city: { type: String, required: [true, "Hotel city info is required"], trim: true },
    state: { type: String, required: [true, "Hotel state info is required"], trim: true },
    country: { type: String, required: [true, "Hotel country info is required"], trim: true },
    pincode: { type: Number, required: [true, "Hotel area pinCode is required"] }
  }],
  contact: [{
    phone: { type: Number, required: [true, "Hotel phone number is required"] },
    email: { type: String, required: [true, "Hotel email is required"], trim: true }
  }],
  facilities: { type: [String], required: [true, "Hotel facilities is required"] },
  images: { type: [String], required: [true, "Hotel images are required"] },
  rating: { type: Number, default: 0 },
  totalRooms: { type: Number, required: [true, "Hotel totalRooms is required"] },
  availableRooms: { type: Number, required: [true, "Hotel availableRooms is required"] },
  pricePerNight: { type: Number, required: [true, "Hotel pricePerNight is required"] },

   goodToKnow: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

  admin: { type: mongoose.Types.ObjectId, ref: "Admin", required: true }
}, { timestamps: true });

const Hotel = mongoose.model("Hotel", hotelSchema)

module.exports = Hotel