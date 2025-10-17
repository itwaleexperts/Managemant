import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminGroupDeals() {
  const [groupDeals, setGroupDeals] = useState([]);
  const [popularHotels, setPopularHotels] = useState([]);
  const [dealForm, setDealForm] = useState({ name: "", email: "", phone: "", hotel: "", rooms: 1, message: "" });
const [hotelForm, setHotelForm] = useState({ name: "", country: "", images: [] });
  const [editingDealId, setEditingDealId] = useState(null);

  const dealsApi = "https://apiyatraadda.jaspersoftwaresolutions.com/api/group";
  const hotelsApi = "https://apiyatraadda.jaspersoftwaresolutions.com/api/group";

  useEffect(() => {
    fetchDeals();
    fetchHotels();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await axios.get(`${dealsApi}/deals`);
      setGroupDeals(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${hotelsApi}/hotels`);
      setPopularHotels(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDealChange = (e) => setDealForm({ ...dealForm, [e.target.name]: e.target.value });
  const handleHotelChange = (e) => setHotelForm({ ...hotelForm, [e.target.name]: e.target.value });

  const submitDeal = async () => {
    try {
      if (editingDealId) {
        await axios.put(`${dealsApi}/deals/${editingDealId}`, dealForm);
        setEditingDealId(null);
      } else {
        await axios.post(`${dealsApi}/deals`, dealForm);
      }
      setDealForm({ name: "", email: "", phone: "", hotel: "", rooms: 1, message: "" });
      fetchDeals();
    } catch (err) {
      console.error(err);
      alert("Error saving deal");
    }
  };

  const editDeal = (deal) => {
    setDealForm({
      name: deal.name,
      email: deal.email,
      phone: deal.phone,
      hotel: deal.hotel,
      rooms: deal.rooms,
      message: deal.message
    });
    setEditingDealId(deal._id);
  };

  const deleteDeal = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try {
      await axios.delete(`${dealsApi}/deals/${id}`);
      fetchDeals();
    } catch (err) { console.error(err); }
  };

const submitHotel = async () => {
  try {
    const formData = new FormData();
    formData.append("name", hotelForm.name);
    formData.append("country", hotelForm.country);

    // append all selected files
    for (let i = 0; i < hotelForm.images.length; i++) {
      formData.append("images", hotelForm.images[i]);
    }

    await axios.post(`${hotelsApi}/hotels`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setHotelForm({ name: "", country: "", images: [] });
    fetchHotels();
  } catch (err) {
    console.error(err);
    alert("Error saving hotel");
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Group Deals Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingDealId ? "Edit Deal" : "Create New Deal"}</h2>
        <input placeholder="Name" name="name" value={dealForm.name} onChange={handleDealChange} className="border p-2 w-full mb-2" />
        <input placeholder="Email" name="email" value={dealForm.email} onChange={handleDealChange} className="border p-2 w-full mb-2" />
        <input placeholder="Phone" name="phone" value={dealForm.phone} onChange={handleDealChange} className="border p-2 w-full mb-2" />
        <input placeholder="Hotel" name="hotel" value={dealForm.hotel} onChange={handleDealChange} className="border p-2 w-full mb-2" />
        <input type="number" placeholder="Rooms" name="rooms" value={dealForm.rooms} onChange={handleDealChange} className="border p-2 w-full mb-2" />
        <textarea placeholder="Message" name="message" value={dealForm.message} onChange={handleDealChange} className="border p-2 w-full mb-2" />
        <button onClick={submitDeal} className="bg-blue-600 text-white px-4 py-2 rounded">{editingDealId ? "Update Deal" : "Create Deal"}</button>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Existing Deals</h2>
        {groupDeals.map((deal) => (
          <div key={deal._id} className="border p-3 mb-2 rounded flex justify-between items-center">
            <div>
              <p><strong>{deal.name}</strong> ({deal.email})</p>
              <p>{deal.hotel} - {deal.rooms} rooms</p>
              <p>{deal.message}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => editDeal(deal)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => deleteDeal(deal._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

<div className="mb-6 p-4 border rounded">
  <h2 className="font-semibold mb-2">Add Popular Hotel</h2>
  <input
    placeholder="Name"
    name="name"
    value={hotelForm.name}
    onChange={handleHotelChange}
    className="border p-2 w-full mb-2"
  />
  <input
    placeholder="Country"
    name="country"
    value={hotelForm.country}
    onChange={handleHotelChange}
    className="border p-2 w-full mb-2"
  />

<input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => setHotelForm({ ...hotelForm, images: Array.from(e.target.files) })}
/>


  <button
    onClick={submitHotel}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Add Hotel
  </button>
</div>


      <div>
        <h2 className="font-semibold mb-2">Popular Hotels</h2>
        {popularHotels.map((hotel) => (
          <div key={hotel._id} className="border p-3 mb-2 rounded">
            <p><strong>{hotel.name}</strong> ({hotel.country})</p>
            {hotel.image && <img src={hotel.image} alt={hotel.name} className="h-16 w-32 object-cover mt-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}
