import React, { useState, useEffect } from "react";
import axios from "axios";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel";

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      const safeHotels = res.data.map(hotel => ({
        ...hotel,
        location: Array.isArray(hotel.location) ? hotel.location[0] : hotel.location,
      }));
      setHotels(safeHotels);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading hotels...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotels</h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Price (₹)</th>
              <th className="px-4 py-2 text-left">Images</th>
            </tr>
          </thead>
          <tbody>
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <tr key={hotel._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{hotel.name}</td>
                  <td className="px-4 py-2">{hotel.location?.city}</td>
                  <td className="px-4 py-2">{hotel.rating}</td>
                  <td className="px-4 py-2">₹{hotel.pricePerNight}</td>
                  <td className="px-4 py-2 flex">
                    {hotel.images && hotel.images.length > 0 && (
                      <img
                        src={`https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${hotel.images[0]}`}
                        alt={hotel.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No hotels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hotels;