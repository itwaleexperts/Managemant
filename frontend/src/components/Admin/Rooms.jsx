import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [form, setForm] = useState({
    hotelId: "",
    roomNumber: "",
    roomType: "",
    pricePerNight: "",
    roomStatus: "available",
    floorNumber: "",
    capacity: 1,
    isSmoking: false,
    isWindow: false,
    amenities: [],
    number : "",
    email : "",
    about : "",
    images: [],
  });

  const ROOM_API = "https://apiyatraadda.jaspersoftwaresolutions.com/api/room";
  const HOTEL_API = "https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel/all";

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(ROOM_API);
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get(HOTEL_API);
      setHotels(data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "amenities") {
      const amenitiesArray = value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      setForm({ ...form, [name]: amenitiesArray });
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedImages = [...form.images, ...files];
    setForm({ ...form, images: updatedImages });
    const previews = updatedImages.map((file) =>
      file instanceof File ? URL.createObjectURL(file) : `https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${file}`
    );
    setImagesPreview(previews);
  };

  const openAddModal = () => {
    setForm({
      hotelId: "",
      roomNumber: "",
      roomType: "",
      pricePerNight: "",
      roomStatus: "available",
      floorNumber: "",
      capacity: 1,
      isSmoking: false,
      isWindow: false,
      amenities: [],
      number : "",
      email : "",
      about : "",
      images: [],
    });
    setImagesPreview([]);
    setExistingImages([]);
    setEditRoom(null);
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setExistingImages(room.images || []);
    setImagesPreview(room.images?.map((img) => `https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${img}`) || []);
    setEditRoom(room._id);
    setForm({
      hotelId: room.hotelId?._id || "",
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      roomStatus: room.roomStatus,
      floorNumber: room.floorNumber || "",
      capacity: room.capacity,
      isSmoking: room.isSmoking,
      isWindow: room.isWindow,
      amenities: Array.isArray(room.amenities) ? room.amenities : [], 
      number : room.number,
      email : room.email,
      about : room?.about,
      images: [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`${ROOM_API}/${id}`);
        setRooms(rooms.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("hotelId", form.hotelId);
      formData.append("roomNumber", form.roomNumber);
      formData.append("roomType", form.roomType);
      formData.append("pricePerNight", form.pricePerNight);
      formData.append("roomStatus", form.roomStatus);
      formData.append("floorNumber", form.floorNumber);
      formData.append("capacity", form.capacity);
      formData.append("isSmoking", form.isSmoking);
      formData.append("isWindow", form.isWindow);
      formData.append("amenities",(form.amenities));
      formData.append("number",form.number)
      formData.append("email",form.email)
      formData.append("about",form.about)

      if (form.images.length > 0) {
        form.images.forEach((img) => formData.append("images", img));
      }
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      if (editRoom) {
        await axios.put(`${ROOM_API}/${editRoom}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${ROOM_API}/${form.hotelId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Rooms Management</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Room
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
        <table className="min-w-full table-auto">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Hotel</th>
              <th className="px-4 py-2 text-left">Room No.</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Price (₹)</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
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
                        alt="room-0"
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
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(room)}
                      className="bg-yellow-400 p-2 rounded text-white hover:bg-yellow-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="bg-red-500 p-2 rounded text-white hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-start pt-10 bg-black bg-opacity-50 z-50 overflow-auto">
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-2xl font-semibold mb-5 text-gray-800">
              {editRoom ? "Edit Room" : "Add New Room"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel
                </label>
                <select
                  name="hotelId"
                  value={form.hotelId}
                  onChange={handleChange}
                  required
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Select Hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number
                </label>
                <input
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  required
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <input
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                  required
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night (₹)
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={form.pricePerNight}
                  onChange={handleChange}
                  required
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor Number
                </label>
                <input
                  type="number"
                  name="floorNumber"
                  value={form.floorNumber}
                  onChange={handleChange}
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  min={1}
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  name="amenities"
                  value={form.amenities.join(", ")} 
                  onChange={handleChange}
                  placeholder="AC, TV, Wifi"
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number
                </label>
                <input
                  type="number"
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  min={1}
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  min={1}
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About
                </label>
                <input
                  type="text"
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  min={1}
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isSmoking"
                    checked={form.isSmoking}
                    onChange={handleChange}
                  />
                  <span>Smoking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isWindow"
                    checked={form.isWindow}
                    onChange={handleChange}
                  />
                  <span>Window</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="roomStatus"
                  value={form.roomStatus}
                  onChange={handleChange}
                  className="border rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border rounded w-full p-2"
                />
                {imagesPreview.length > 0 && (
                  <div className="flex flex-wrap mt-2 gap-2">
                    {imagesPreview.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`preview-${idx}`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                >
                  {loading
                    ? "Saving..."
                    : editRoom
                    ? "Update Room"
                    : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;