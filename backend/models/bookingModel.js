const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },

    destination: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },

    roomType: { type: String, required: true },
    roomPrice: { type: Number, required: true },
    cityTax: { type: Number, default: 0 },
    currencySymbol: { type: String, default: "₹" },
    localCurrency: { type: String, default: "INR" },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    paymentMethod: {
      type: String,
      enum: ["Card", "PayPal", "Google Pay"],
      required: true,
    },
    payNow: { type: Number, required: true },
    totalPrice: { type: Number },

    extras: [{ type: String }],

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
