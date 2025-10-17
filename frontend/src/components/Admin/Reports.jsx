import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const Revenue = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const STATUS_COLORS = ["#10b981", "#f59e0b"]; 

  useEffect(() => {
    axios
      .get("https://apiyatraadda.jaspersoftwaresolutions.com/api/report/get")
      .then((res) => {
        console.log("API Response:", res.data); 
        setReport(res.data);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        setError("Failed to load revenue report. Please try again later.");
      });
  }, []);

  if (!report && !error) {
    return <p className="text-center mt-10 text-gray-500">Loading report...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  const { totalRevenue = 0, totalHotels = 0, totalBookings = 0, hotelRevenue = [], monthlyRevenue = [] } = report;

  const bookingStatusData = hotelRevenue.reduce(
    (acc, hotel) => {
      acc[0].value += hotel.confirmedBookings || 0;
      acc[1].value += hotel.pendingBookings || 0;
      return acc;
    },
    [
      { name: "Confirmed Bookings", value: 0 },
      { name: "Pending Bookings", value: 0 },
    ]
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Total Hotels</h3>
          <p className="text-3xl font-bold mt-2">{totalHotels}</p>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Total Bookings</h3>
          <p className="text-3xl font-bold mt-2">{totalBookings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Revenue (₹)</h3>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No monthly revenue data available</p>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Hotel-wise Revenue</h3>
          {hotelRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hotelRevenue}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {hotelRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No hotel revenue data available</p>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Booking Status Distribution</h3>
          {bookingStatusData.some((entry) => entry.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No booking status data available</p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-xl font-semibold text-gray-700 p-4">Hotel-wise Revenue</h3>
        <table className="min-w-full table-auto">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Hotel</th>
              <th className="px-4 py-2 text-left">Revenue (₹)</th>
              <th className="px-4 py-2 text-left">Bookings Count</th>
              <th className="px-4 py-2 text-left">Confirmed Bookings</th>
              <th className="px-4 py-2 text-left">Pending Bookings</th>
            </tr>
          </thead>
          <tbody>
            {hotelRevenue.length > 0 ? (
              hotelRevenue.map((hotel) => (
                <tr key={hotel.hotelId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{hotel.name || "Unknown Hotel"}</td>
                  <td className="px-4 py-2 font-semibold text-green-700">
                    ₹ {(hotel.revenue || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{hotel.bookingsCount || 0}</td>
                  <td className="px-4 py-2">{hotel.confirmedBookings || 0}</td>
                  <td className="px-4 py-2">{hotel.pendingBookings || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                  No hotel revenue data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Revenue;