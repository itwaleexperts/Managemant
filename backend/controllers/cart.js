const Cart = require("../models/cartModel.js")
const Room = require("../models/roomModel.js")


exports.createCart = async (req, res) => {
  try {
const { roomId, quantity, checkInDate, checkOutDate } = req.body;
    const userId= req.userId
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    const nights =
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = room.pricePerNight * quantity * nights;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        rooms: [
          {
            roomId,
            roomName: room.roomNumber,
            quantity,
            pricePerNight: room.pricePerNight,
            checkInDate,
            checkOutDate,
            totalPrice,
          },
        ],
        totalAmount: totalPrice,
      });
    } else {

      const existingRoomIndex = cart.rooms.findIndex(
        (r) =>
          r.roomId.toString() === roomId &&
          r.checkInDate.toISOString() === new Date(checkInDate).toISOString() &&
          r.checkOutDate.toISOString() === new Date(checkOutDate).toISOString()
      );

      if (existingRoomIndex > -1) {

        cart.rooms[existingRoomIndex].quantity += quantity;
        cart.rooms[existingRoomIndex].totalPrice += totalPrice;
      } else {

        cart.rooms.push({
          roomId,
          roomName: room.roomNumber,
          quantity,
          pricePerNight: room.pricePerNight,
          checkInDate,
          checkOutDate,
          totalPrice,
        });
      }

      cart.totalAmount = cart.rooms.reduce((acc, item) => acc + item.totalPrice, 0);
    }
   const save = await cart.save();
    res.status(200).json({message : "add to cart successfull!", data : save});
  } catch (error) {
    console.log("createCart error is :-",error)
    res.status(500).json({message : error.message})
  }
}


exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId }).populate("rooms.roomId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { roomId, checkInDate, checkOutDate } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.rooms = cart.rooms.filter(
      (r) =>
        !(
          r.roomId.toString() === roomId &&
          r.checkInDate.toISOString() === new Date(checkInDate).toISOString() &&
          r.checkOutDate.toISOString() === new Date(checkOutDate).toISOString()
        )
    );

    cart.totalAmount = cart.rooms.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { roomId, checkInDate, checkOutDate, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const roomIndex = cart.rooms.findIndex(
      (r) =>
        r.roomId.toString() === roomId &&
        r.checkInDate.toISOString() === new Date(checkInDate).toISOString() &&
        r.checkOutDate.toISOString() === new Date(checkOutDate).toISOString()
    );

    if (roomIndex === -1) return res.status(404).json({ message: "Room not found in cart" });

    const room = cart.rooms[roomIndex];
    const nights =
      (new Date(room.checkOutDate) - new Date(room.checkInDate)) / (1000 * 60 * 60 * 24);

    room.quantity = quantity;
    room.totalPrice = room.pricePerNight * quantity * nights;

    cart.totalAmount = cart.rooms.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
