const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    rooms: [
      {
        roomId: { type: mongoose.Types.ObjectId, ref: "Room", required: true },
        roomName: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        pricePerNight: { type: Number, required: true },
        checkInDate: { type: Date, required: true },
        checkOutDate: { type: Date, required: true },
        totalPrice: { type: Number, required: true },
        dateAdded: { type: Date, default: Date.now },
      },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;