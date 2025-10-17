const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "please enter your name"] },
  email: { type: String, required: [true, "please enter your email"] },
  password: { type: String, required: [true, "please enter your password"] },
  phone: { type: Number, default: "" },
 bookings: [
  {
    bookingId: { type: mongoose.Types.ObjectId, ref: "Booking" },
    hotelId: { type: mongoose.Types.ObjectId, ref: "Hotel" },
    roomId: { type: mongoose.Types.ObjectId, ref: "Room" },
    checkInDate: Date,
    checkOutDate: Date,
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    bookedAt: { type: Date, default: Date.now } 
  }
]

});

const User = mongoose.model("User", userSchema);
module.exports = User;