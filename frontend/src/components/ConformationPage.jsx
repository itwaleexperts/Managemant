import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import {
  Clock,
  Mail,
  CalendarDays,
  Phone,
  Hotel,
  MapPin,
  Moon,
  Loader2,
} from "lucide-react";

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [hotel, setHotel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`https://apiyatraadda.jaspersoftwaresolutions.com/api/booking/${bookingId}`);
        setBooking(res.data.booking);
        setHotel([res.data.booking.hotelId]);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
        <p className="text-lg mb-4">Booking not found.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    );

  const { checkIn, checkOut, roomType, nights, phone, email, status, totalPrice } = booking;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100 py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full p-8 border border-gray-100"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <Clock className="w-8 h-8" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800">
              Booking Submitted Successfully!
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Thank you for choosing us. Please check your email for confirmation
              once approved by the hotel admin.
            </p>
          </div>

          {hotel.map((data) => (
            <div key={data._id} className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl mb-6">
              <img
                src={`https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${data.images?.[0]}`}
                alt={data.name}
                className="w-28 h-28 rounded-lg object-cover shadow-md"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{data.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  {data.location?.[0]?.city || "Unknown Location"}
                </p>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-medium flex items-center gap-2 text-gray-600">
                <CalendarDays className="text-blue-500 w-4 h-4" /> Check-In
              </p>
              <p className="text-lg">{new Date(checkIn).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-medium flex items-center gap-2 text-gray-600">
                <CalendarDays className="text-green-500 w-4 h-4" /> Check-Out
              </p>
              <p className="text-lg">{new Date(checkOut).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-medium flex items-center gap-2 text-gray-600">
                <Hotel className="text-indigo-500 w-4 h-4" /> Room Type
              </p>
              <p className="text-lg">{roomType}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-medium flex items-center gap-2 text-gray-600">
                <Moon className="text-purple-500 w-4 h-4" /> Nights
              </p>
              <p className="text-lg">{nights}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-medium flex items-center gap-2 text-gray-600">
                <Phone className="text-teal-500 w-4 h-4" /> Phone
              </p>
              <p className="text-lg">{phone}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-medium flex items-center gap-2 text-gray-600">
                <Mail className="text-pink-500 w-4 h-4" /> Email
              </p>
              <p className="text-lg break-words">{email}</p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
            <p className="text-lg font-semibold text-gray-800">
              Total Amount: <span className="text-blue-600 font-bold">₹{totalPrice}</span>
            </p>
            <p className="mt-2">
              Current Status:{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status}
              </span>
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/account")}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              View My Bookings
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default BookingConfirmationPage;
