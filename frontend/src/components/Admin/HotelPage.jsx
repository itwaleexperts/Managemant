import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: { address: "", city: "", state: "", country: "", pincode: "" },
    contact: { phone: "", email: "" },
    facilities: "",
    images: [],
    rating: "",
    totalRooms: "",
    availableRooms: "",
    pricePerNight: "",
    goodToKnow: [{ question: "", answer: "" }],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const API_BASE = "https://apiyatraadda.jaspersoftwaresolutions.com/api/hotel";

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      const safeHotels = res.data.map(hotel => ({
        ...hotel,
        location: Array.isArray(hotel.location) ? hotel.location[0] : hotel.location,
        contact: Array.isArray(hotel.contact) ? hotel.contact[0] : hotel.contact,
        facilities: Array.isArray(hotel.facilities) ? hotel.facilities : hotel.facilities,
        goodToKnow: Array.isArray(hotel.goodToKnow) ? hotel.goodToKnow : [], // ✅ Handle goodToKnow
      }));
      setHotels(safeHotels);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setForm({ ...form, location: { ...form.location, [key]: value } });
    } else if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setForm({ ...form, contact: { ...form.contact, [key]: value } });
    } else if (name.startsWith("goodToKnow.")) {
      const [_, field, idx] = name.split(".");
      const updatedGoodToKnow = [...form.goodToKnow];
      updatedGoodToKnow[idx] = { ...updatedGoodToKnow[idx], [field]: value };
      setForm({ ...form, goodToKnow: updatedGoodToKnow });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prevForm) => ({ ...prevForm, images: [...prevForm.images, ...files] }));

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviewUrls]);
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      const updatedExisting = existingImages.filter((_, idx) => idx !== index);
      setExistingImages(updatedExisting);

      const remainingExistingPreviews = updatedExisting.map((img) => `https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${img}`);
      const newFilesPreviews = previewImages.slice(existingImages.length);
      setPreviewImages([...remainingExistingPreviews, ...newFilesPreviews]);
    } else {
      const existingCount = existingImages.length;
      const fileIndex = index - existingCount;

      const updatedFiles = form.images.filter((_, idx) => idx !== fileIndex);
      setForm((prevForm) => ({ ...prevForm, images: updatedFiles }));

      setPreviewImages((prevPreviews) => prevPreviews.filter((_, idx) => idx !== index));
    }
  };

  const addGoodToKnow = () => {
    setForm({ ...form, goodToKnow: [...form.goodToKnow, { question: "", answer: "" }] });
  };

  const removeGoodToKnow = (index) => {
    setForm({
      ...form,
      goodToKnow: form.goodToKnow.filter((_, idx) => idx !== index),
    });
  };

  const openAddModal = () => {
    setForm({
      name: "",
      description: "",
      location: { address: "", city: "", state: "", country: "", pincode: "" },
      contact: { phone: "", email: "" },
      facilities: "",
      images: [],
      rating: "",
      totalRooms: "",
      availableRooms: "",
      pricePerNight: "",
      goodToKnow: [{ question: "", answer: "" }], 
    });
    setPreviewImages([]);
    setExistingImages([]);
    setEditHotel(null);
    setShowModal(true);
  };

  const openEditModal = (hotel) => {
    let facilitiesData = hotel.facilities;

    if (typeof facilitiesData === "string") {
      try {
        const parsed = JSON.parse(facilitiesData);
        if (Array.isArray(parsed)) {
          facilitiesData = parsed;
        }
      } catch (e) {
      }
    }

    const facilitiesString = Array.isArray(facilitiesData)
      ? facilitiesData.join(", ")
      : typeof facilitiesData === "string" ? facilitiesData : "";

    const locationData = hotel.location || {
      address: "", city: "", state: "", country: "", pincode: "",
    };
    const contactData = hotel.contact || { phone: "", email: "" };
    const goodToKnowData = Array.isArray(hotel.goodToKnow) && hotel.goodToKnow.length > 0
      ? hotel.goodToKnow
      : [{ question: "", answer: "" }];

    const existingImgs = hotel.images || [];
    setExistingImages(existingImgs);

    setForm({
      ...hotel,
      facilities: facilitiesString,
      location: locationData,
      contact: contactData,
      images: [],
      goodToKnow: goodToKnowData, 
    });

    setPreviewImages(existingImgs.map((img) => `https://apiyatraadda.jaspersoftwaresolutions.com/uploads/${img}`));
    setEditHotel(hotel._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await axios.delete(`${API_BASE}/delete/${id}`);
        alert("Hotel deleted successfully! 🎉");
        fetchHotels();
      } catch (error) {
        console.error("Error deleting hotel:", error);
        alert("Error deleting hotel ");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    try {
      const formData = new FormData();

      let facilitiesArray = form.facilities;
      if (typeof facilitiesArray === "string") {
        facilitiesArray = facilitiesArray
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f !== "");
      } else if (!Array.isArray(facilitiesArray)) {
        facilitiesArray = [];
      }

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("location", JSON.stringify([form.location]));
      formData.append("contact", JSON.stringify([form.contact]));
      formData.append("facilities", JSON.stringify(facilitiesArray));
      formData.append("rating", form.rating);
      formData.append("totalRooms", form.totalRooms);
      formData.append("availableRooms", form.availableRooms);
      formData.append("pricePerNight", form.pricePerNight);
      formData.append("goodToKnow", JSON.stringify(form.goodToKnow)); 

      if (form.images && form.images.length > 0) {
        Array.from(form.images).forEach((img) => formData.append("images", img));
      }

      if (editHotel) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      if (editHotel) {
        await axios.put(`${API_BASE}/update/${editHotel}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Hotel updated successfully! ");
      } else {
        await axios.post(`${API_BASE}/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Hotel created successfully! ");
      }

      fetchHotels();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving hotel:", error.response ? error.response.data : error);
      alert(error.response?.data?.message || "Error saving hotel. Check console for details. 🛑");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Hotels</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Hotel
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Price (₹)</th>
              <th className="px-4 py-2 text-left">Images</th>
              <th className="px-4 py-2 text-center">Actions</th>
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
                        alt="hotel"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(hotel)}
                      className="bg-yellow-400 p-2 rounded text-white hover:bg-yellow-500"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="bg-red-500 p-2 rounded text-white hover:bg-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No hotels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto shadow-xl relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editHotel ? "Edit Hotel" : "Add New Hotel"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {["address", "city", "state", "country", "pincode"].map((key) => (
                  <input
                    key={key}
                    name={`location.${key}`}
                    value={form.location[key] || ""}
                    onChange={handleChange}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="contact.phone"
                  value={form.contact.phone || ""}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="contact.email"
                  value={form.contact.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facilities (comma separated)
                </label>
                <input
                  name="facilities"
                  value={form.facilities}
                  onChange={handleChange}
                  placeholder="e.g., WiFi, Pool, Parking"
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Good to Know</label>
                {form.goodToKnow.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <input
                      name={`goodToKnow.question.${index}`}
                      value={item.question}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Question"
                      className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name={`goodToKnow.answer.${index}`}
                      value={item.answer}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Answer"
                      className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeGoodToKnow(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGoodToKnow}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                >
                  Add Good to Know
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="Rating"
                  className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="number"
                  name="totalRooms"
                  value={form.totalRooms}
                  onChange={handleChange}
                  placeholder="Total Rooms"
                  className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="number"
                  name="availableRooms"
                  value={form.availableRooms}
                  onChange={handleChange}
                  placeholder="Available Rooms"
                  className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="number"
                  name="pricePerNight"
                  value={form.pricePerNight}
                  onChange={handleChange}
                  placeholder="Price Per Night"
                  className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex mt-2 gap-2 flex-wrap">
                  {previewImages.map((img, idx) => {
                    const isExisting = idx < existingImages.length && img.startsWith("https://apiyatraadda.jaspersoftwaresolutions.com/uploads");
                    return (
                      <div key={idx} className="relative w-20 h-20 rounded">
                        <img
                          src={img}
                          alt="preview"
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx, isExisting)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold hover:bg-red-700 transition"
                          title="Remove image"
                        >
                          X
                        </button>
                      </div>
                    );
                  })}
                </div>
                {editHotel && existingImages.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Existing images (click 'X' to remove before updating).</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editHotel ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;