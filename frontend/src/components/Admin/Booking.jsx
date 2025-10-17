import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/booking");
      const sortedBookings = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sortedBookings);
      console.log(sortedBookings);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const total = bookings.reduce(
      (sum, b) => sum + Number(b.roomPrice + b.cityTax),
      0
    );
    setTotalRevenue(total);
  }, [bookings]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/booking/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
      alert("Booking deleted successfully")
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading bookings...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Total Bookings</h3>
          <p className="text-3xl font-bold mt-2">{bookings.length}</p>
        </div>

        <div className="bg-green-600 text-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹ {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-purple-600 text-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Average per Booking</h3>
          <p className="text-3xl font-bold mt-2">
            ₹ {bookings.length ? Math.round(totalRevenue / bookings.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-2 text-left">User Name</th>
              <th className="px-4 py-2 text-left">Hotel</th>
              <th className="px-4 py-2 text-left">Room Type</th>
              <th className="px-4 py-2 text-left">Check-in</th>
              <th className="px-4 py-2 text-left">Check-out</th>
              <th className="px-4 py-2 text-left">Total Price (₹)</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{b.firstName} {b.lastName}</td>
                  <td className="px-4 py-2">{b.hotelId?.name || "Unknown Hotel"}</td>
                  <td className="px-4 py-2">{b.roomType}</td>
                  <td className="px-4 py-2">{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-semibold text-green-700">
                    ₹ {(b.totalPrice)}
                  </td>
                  <td className="px-6 py-2 text-center">
                    <button
                      onClick={() => navigate(`/viewbooking/${b._id}`)}
                      className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-red-500 p-2 rounded text-white hover:bg-red-600 ml-4"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;