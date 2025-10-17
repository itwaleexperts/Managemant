import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const Revenue = () => {
  const [report, setReport] = useState(null);
  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/report/get")
      .then(res => setReport(res.data))
      .catch(err => console.error("Error fetching report:", err));
  }, []);

  if (!report) {
    return <p className="text-center mt-10 text-gray-500">Loading report...</p>;
  }

  const { totalRevenue, totalHotels, totalBookings, hotelRevenue, monthlyRevenue } = report;

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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Hotel-wise Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={hotelRevenue} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {hotelRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}} fill={COLORS[index % COLORS.length]`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Hotel</th>
              <th className="px-4 py-2 text-left">Revenue (₹)</th>
              <th className="px-4 py-2 text-left">Bookings Count</th>
            </tr>
          </thead>
          <tbody>
            {hotelRevenue.map((hotel) => (
              <tr key={hotel.hotelId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{hotel.name}</td>
                <td className="px-4 py-2 font-semibold text-green-700">₹ {hotel.revenue.toLocaleString()}</td>
                <td className="px-4 py-2">{hotel.bookingsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Revenue;