import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaHotel,
  FaBed,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: "bg-yellow-500/20 text-white border-yellow-400",
    Confirmed: "bg-green-500/20 text-white border-green-500",
    Cancelled: "bg-red-500/20 text-white border-red-500",
  };

  return (
    <span
      className={`px-5 py-2 border text-sm font-semibold rounded-full backdrop-blur-sm shadow-sm ${colors[status] || "bg-gray-100 text-gray-700 border-gray-300"}`}
    >
      {status}
    </span>
  );
};

export default function ViewBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`https://apiyatraadda.jaspersoftwaresolutions.com/api/booking/${id}`);
        const fetchedBooking = res.data.booking || res.data;
        setBooking(fetchedBooking);
      } catch (err) {
        console.error(" Error fetching booking details:", err);
      }
    };
    fetchBooking();
  }, [id]);

  if (!booking)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <p className="text-gray-600 text-lg animate-pulse">Loading booking details...</p>
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-16 px-6">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md shadow-2xl border border-white/50 rounded-3xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition"
              >
                <FaArrowLeft /> Back
              </button>
              <h1 className="text-2xl font-bold tracking-wide">Booking Summary</h1>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="p-10 space-y-10">

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl shadow-inner bg-gradient-to-br from-white to-blue-50 border border-blue-100">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-4">
                  <FaUser className="text-blue-500" /> Guest Details
                </h2>
                <p><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
                <p className="flex items-center gap-2 text-gray-700 mt-2">
                  <FaEnvelope className="text-gray-500" /> {booking.email}
                </p>
                <p className="flex items-center gap-2 text-gray-700 mt-1">
                  <FaPhoneAlt className="text-gray-500" /> {booking.phone}
                </p>
                <p className="mt-2"><strong>Payment:</strong> {booking.paymentMethod}</p>
              </div>

              <div className="p-6 rounded-2xl shadow-inner bg-gradient-to-br from-green-50 to-white border border-green-100">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-4">
                  <FaHotel className="text-green-600" /> Hotel Details
                </h2>
                <p><strong>Hotel:</strong> {booking.hotelId?.name || "Unknown Hotel"}</p>
                <p><strong>Room Type:</strong> {booking.roomType}</p>
                <p><strong>Room No:</strong> {booking.roomId?.roomNumber || "N/A"}</p>
                <p><strong>Nights:</strong> {booking.nights}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-5 bg-white rounded-xl border-l-4 border-blue-500 shadow-sm">
                <p className="flex items-center gap-2 font-semibold text-gray-700">
                  <FaCalendarAlt /> Check-In Date
                </p>
                <p className="text-xl font-bold text-blue-700 mt-1">
                  {new Date(booking.checkIn).toLocaleDateString()}
                </p>
              </div>
              <div className="p-5 bg-white rounded-xl border-l-4 border-green-500 shadow-sm">
                <p className="flex items-center gap-2 font-semibold text-gray-700">
                  <FaCalendarAlt /> Check-Out Date
                </p>
                <p className="text-xl font-bold text-green-700 mt-1">
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 rounded-3xl border border-gray-200 text-center shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex justify-center items-center gap-2">
                <FaMoneyBillWave className="text-green-600" /> Payment Summary
              </h3>

              <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                <div className="bg-white shadow-sm rounded-xl py-4 border border-gray-100">
                  <p>Room Price</p>
                  <p className="font-bold text-lg text-blue-600">
                    ₹{booking.roomPrice?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-xl py-4 border border-gray-100">
                  <p>City Tax</p>
                  <p className="font-bold text-lg text-blue-600">
                    ₹{booking.cityTax?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-4 shadow-lg">
                  <p>Total</p>
                  <p className="font-bold text-xl">
                    ₹{booking.totalPrice?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

         
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
