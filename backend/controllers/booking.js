const Booking = require("../models/bookingModel");
const User = require("../models/userModel.js");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Room = require("../models/roomModel.js")
exports.addBooking = async (req, res) => {
    try {
        const userId = req.userId; 

        const { 
            hotelId, roomId, destination, checkIn, checkOut, roomType, nights, 
            roomPrice, cityTax, currencySymbol, localCurrency, firstName, 
            lastName, email, phone, paymentMethod, payNow, totalPrice, extras ,status
        } = req.body;
      console.log(nights)
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated. UserId is missing from token." });
        }

        if (!hotelId || !roomId) {
            return res.status(400).json({ message: "hotelId and roomId are required in the request body." });
        }


        const total = roomPrice + cityTax 

        const newBooking = new Booking({
            userId, 
            destination,
            checkIn,
            checkOut,
            roomType,
            nights,
            roomPrice,
            cityTax,
            currencySymbol,
            localCurrency,
            firstName,
            lastName,
            email,
            phone,
            paymentMethod,
            payNow : totalPrice,
            totalPrice,
            extras,
            status: status,
            hotelId,
            roomId
        });

        const savedBooking = await newBooking.save();
const user = await User.findByIdAndUpdate(
            userId,
            { $push: { bookings: {
                bookingId: savedBooking._id,
                hotelId,
                roomId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice: total,
                status: "Pending"
            } }},
            { new: true }
        ).populate("bookings.hotelId").populate("bookings.roomId");

          await Room.findByIdAndUpdate(roomId, { roomStatus: "booked" });


        res.status(200).json({ message: "Booking added successfully", data: { user, booking: savedBooking } });

    } catch (error) {
        console.log("addBooking error =============>", error);
        res.status(500).json({ message: error.message });
    }
};



exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate({
      path : "hotelId",
      select : "name"
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("hotelId")  
      .populate("roomId"); 

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "shabansaiyed0@gmail.com",      
    pass: "frhsgsoxmhjfxoci",          
  },
});

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["Pending", "Confirmed", "Cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await User.updateOne(
  { "bookings.bookingId": updatedBooking._id },
  { $set: { "bookings.$.status": status } }
);


    const mailOptions = {
      from: '"Hotel Booking" <shabansaiyed0@gmail.com>',  
      to: updatedBooking.email,                        
      subject: `Booking ${status}`,
      html: `
        <h3>Hello ${updatedBooking.firstName},</h3>
        <p>Your booking at <b>${updatedBooking.destination}</b> has been updated to <b>${status}</b>.</p>
        <p>Booking Details:</p>
        <ul>
          <li>Room Type: ${updatedBooking.roomType}</li>
          <li>Check-in: ${new Date(updatedBooking.checkIn).toLocaleDateString()}</li>
          <li>Check-out: ${new Date(updatedBooking.checkOut).toLocaleDateString()}</li>
          <li>Total Price: ₹${updatedBooking.totalPrice?.toLocaleString() || "N/A"}</li>
        </ul>
        <p>Thank you for booking with us!</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(" Booking status email sent to user:", updatedBooking.email);
    } catch (err) {
      console.error(" Error sending booking email:", err);
    }

    res.json({
      message: "Booking status updated successfully and email sent",
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: err.message});
  }
};
