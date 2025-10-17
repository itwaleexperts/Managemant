import React, { useState, useEffect } from "react";
import axios from "axios";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const ROOM_API = "https://apiyatraadda.jaspersoftwaresolutions.com/api/room";

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(ROOM_API);
      setRooms(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading rooms...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Rooms</h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Hotel</th>
              <th className="px-4 py-2 text-left">Room No.</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Price (₹)</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 flex gap-1">
                    {room.images && room.images.length > 0 ? (
                      <img
                        src={`https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${room.images[0]}`}
                        alt={`room-${room.roomNumber}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{room.hotelId?.name || "Unknown"}</td>
                  <td className="px-4 py-2">{room.roomNumber}</td>
                  <td className="px-4 py-2">{room.roomType}</td>
                  <td className="px-4 py-2">{room.pricePerNight}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        room.roomStatus === "available" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {room.roomStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rooms;