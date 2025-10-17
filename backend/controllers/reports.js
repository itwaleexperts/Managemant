const Booking = require("../models/bookingModel.js");
const Hotel = require("../models/hotelModel.js");

exports.report = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    const bookings = await Booking.find();

    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.roomPrice + b.cityTax), 0);

    const totalHotels = hotels.length;
    const totalBookings = bookings.length;

    const hotelRevenue = hotels.map((hotel) => {
      const hotelBookings = bookings.filter((b) => b.hotelId && b.hotelId.toString() === hotel._id.toString());

      const revenue = hotelBookings.reduce((sum, b) => sum + Number(b.roomPrice + b.cityTax), 0);

      const confirmedBookings = hotelBookings.filter((b) => b.status === "confirmed").length;
      const pendingBookings = hotelBookings.filter((b) => b.status === "pending").length;

      return {
        hotelId: hotel._id,
        name: hotel.name,
        revenue,
        bookingsCount: hotelBookings.length,
        confirmedBookings,
        pendingBookings,
      };
    });

    const monthlyRevenueMap = {};
    bookings.forEach((b) => {
      const date = new Date(b.createdAt || b.checkIn);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const key = `${month}-${year}`;
      if (!monthlyRevenueMap[key]) monthlyRevenueMap[key] = 0;
      monthlyRevenueMap[key] += Number(b.roomPrice + b.cityTax);
    });

    const monthlyRevenue = Object.keys(monthlyRevenueMap)
      .map((key) => ({
        month: key,
        revenue: monthlyRevenueMap[key],
      }))
      .sort((a, b) => {
        const [m1, y1] = a.month.split("-");
        const [m2, y2] = b.month.split("-");
        return new Date(`${m1} 1, ${y1}`) - new Date(`${m2} 1, ${y2}`);
      });

    res.json({
      totalRevenue,
      totalHotels,
      totalBookings,
      hotelRevenue,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Revenue Report Error:", error); 
    res.status(500).json({ message: "Server Error" });
  }
};