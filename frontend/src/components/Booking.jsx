import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoginModal from "../components/Login";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const selectedRoom = location.state?.room;

  const parseDate = (dateString) => (dateString ? new Date(dateString) : new Date());
  if (!selectedRoom) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        <p>No room selected. Please go back and choose a room.</p>
      </div>
    );
  }

  const singleNightPrice = selectedRoom.price || 0;
  const [checkIn, setCheckIn] = useState(parseDate(selectedRoom.checkInDate));
  const [checkOut, setCheckOut] = useState(
    parseDate(selectedRoom.checkOutDate) || new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "Card",
  });

  const calcNights = (start, end) => {
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff));
  };

  const nights = calcNights(checkIn, checkOut);
  const roomCharge = singleNightPrice * selectedRoom.quantity * nights;
  const cityTax = 1.17 * selectedRoom.quantity;
  const total = roomCharge + cityTax;
console.log(total)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("🔒 Please log in to complete your booking.");
      setIsLoginModalOpen(true);
      setLoading(false);
      return;
    }

 const bookingPayload = {
  roomId: selectedRoom.id,
  hotelId,
  destination: selectedRoom.destination || "Unknown",
  checkIn: checkIn.toISOString().split("T")[0],
  checkOut: checkOut.toISOString().split("T")[0],
  roomType: selectedRoom.roomType,
  nights,
  roomPrice: Number(singleNightPrice),
  roomQuantity: Number(selectedRoom.quantity) || 1,
  cityTax: Number(cityTax),
  totalPrice: total,
  firstName: formData.firstName,
  lastName: formData.lastName,
  email: formData.email,
  phone: formData.phone,
  paymentMethod: formData.paymentMethod,
  payNow: true, 
};


    try {
      const res = await axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/booking", bookingPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🎉 Booking request sent successfully! Please check your email for confirmation.");
      navigate(`/booking/confirm/${res.data.data.booking._id}`, {
        state: { bookingDetails: res.data.data.booking },
      });
    } catch (err) {
      alert(` Booking failed: ${err.response?.data?.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center py-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl p-10 space-y-8 border border-gray-200 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.08)]"
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Book Your Stay — <span className="text-blue-600">{selectedRoom.roomType}</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-600">Check-In</label>
              <DatePicker
                selected={checkIn}
                onChange={(date) => {
                  setCheckIn(date);
                  if (date >= checkOut)
                    setCheckOut(new Date(date.getTime() + 24 * 60 * 60 * 1000));
                }}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-600">Check-Out</label>
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                minDate={new Date(checkIn.getTime() + 24 * 60 * 60 * 1000)}
                dateFormat="dd/MM/yyyy"
                className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              onChange={handleChange}
              className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              onChange={handleChange}
              className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              onChange={handleChange}
              className="border p-3 rounded-lg shadow-sm md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone *"
              onChange={handleChange}
              className="border p-3 rounded-lg shadow-sm md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <h2 className="font-semibold text-gray-700 mt-6 mb-3 text-lg">Payment Method</h2>
            <div className="flex flex-wrap gap-3">
              {["Card", "PayPal", "Google Pay"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-sm font-medium transition ${
                    formData.paymentMethod === method
                      ? "bg-blue-100 border-blue-400 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border mt-6">
            <h3 className="font-bold text-xl text-gray-800 mb-4 border-b pb-2">
              💰 Price Summary
            </h3>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>
                Room charge ({selectedRoom.quantity}×{nights} nights)
              </span>
              <span>₹{roomCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>City tax (pay at hotel)</span>
              <span>₹{cityTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-xl text-white font-semibold text-lg shadow-md transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg"
            }`}
          >
            {loading ? "Processing..." : `Confirm & Pay ₹${total.toFixed(2)}`}
          </button>
        </form>
      </div>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default BookingPage;
