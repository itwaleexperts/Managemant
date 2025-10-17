import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AdminLocationsPage() {
  const [form, setForm] = useState({
    heroImage: "",
    heroTitle: "",
    heroDescription: "",
    bookingForm: {},
    overviewText: "",
    stats: [],
    openHotels: [],
    underDevelopmentHotels: [],
    boardOfDirectors: { title: "", description: "", buttonText: "" },
    smallTextSections: [],
    shareholderSection: { title: "", description: "", buttonText: "" },
  });
  const [editingId, setEditingId] = useState(null);

  const apiBase = "https://apiyatraadda.jaspersoftwaresolutions.com/api/develop"; 

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${apiBase}/get`);
      if (res.data.success && res.data.data.length > 0) {
        setForm(res.data.data[0]);
        setEditingId(res.data.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e, index, type, subType) => {
    if (type === "stats") {
      const newArr = [...form.stats];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, stats: newArr });
    } else if (type === "openHotels" || type === "underDevelopmentHotels") {
      const newArr = [...form[type]];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, [type]: newArr });
    } else if (type === "boardOfDirectors" || type === "shareholderSection") {
      setForm({ ...form, [type]: { ...form[type], [e.target.name]: e.target.value } });
    } else if (type === "smallTextSections") {
      const newArr = [...form.smallTextSections];
      newArr[index] = e.target.value;
      setForm({ ...form, smallTextSections: newArr });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addItem = (type) => {
    if (type === "stats") setForm({ ...form, stats: [...form.stats, { label: "", value: "" }] });
    else if (type === "openHotels" || type === "underDevelopmentHotels") setForm({ ...form, [type]: [...form[type], { name: "", location: "", price: "", imageUrl: "", type: type === "openHotels" ? "open" : "development" }] });
    else if (type === "smallTextSections") setForm({ ...form, smallTextSections: [...form.smallTextSections, ""] });
  };

  const removeItem = (type, index) => {
    if (type === "stats") setForm({ ...form, stats: form.stats.filter((_, i) => i !== index) });
    else if (type === "openHotels" || type === "underDevelopmentHotels") setForm({ ...form, [type]: form[type].filter((_, i) => i !== index) });
    else if (type === "smallTextSections") setForm({ ...form, smallTextSections: form.smallTextSections.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiBase}/update/${editingId}`, form);
        alert("Locations page updated successfully!");
      } else {
        const res = await axios.post(`${apiBase}/create`, form);
        setEditingId(res.data.data._id);
        alert("Locations page created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Locations Page Admin</h1>

      <div className="mb-4">
        <label className="block font-semibold">Hero Title</label>
        <input name="heroTitle" value={form.heroTitle} onChange={handleChange} className="border p-2 w-full mb-2" />
        <label className="block font-semibold">Hero Image URL</label>
        <input name="heroImage" value={form.heroImage} onChange={handleChange} className="border p-2 w-full mb-2" />
        <label className="block font-semibold">Hero Description</label>
        <textarea name="heroDescription" value={form.heroDescription} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Overview Text</label>
        <textarea name="overviewText" value={form.overviewText} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Stats</h2>
        {form.stats.map((s, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="label" value={s.label} placeholder="Label" onChange={(e) => handleChange(e, i, "stats")} className="border p-2 w-full mb-2" />
            <input name="value" value={s.value} placeholder="Value" onChange={(e) => handleChange(e, i, "stats")} className="border p-2 w-full mb-2" />
            <button onClick={() => removeItem("stats", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("stats")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Stat</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Open Hotels</h2>
        {form.openHotels.map((h, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="name" value={h.name} placeholder="Name" onChange={(e) => handleChange(e, i, "openHotels")} className="border p-2 w-full mb-2" />
            <input name="location" value={h.location} placeholder="Location" onChange={(e) => handleChange(e, i, "openHotels")} className="border p-2 w-full mb-2" />
            <input name="price" value={h.price} placeholder="Price" onChange={(e) => handleChange(e, i, "openHotels")} className="border p-2 w-full mb-2" />
            <input name="imageUrl" value={h.imageUrl} placeholder="Image URL" onChange={(e) => handleChange(e, i, "openHotels")} className="border p-2 w-full mb-2" />
            <button onClick={() => removeItem("openHotels", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("openHotels")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Open Hotel</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Under Development Hotels</h2>
        {form.underDevelopmentHotels.map((h, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="name" value={h.name} placeholder="Name" onChange={(e) => handleChange(e, i, "underDevelopmentHotels")} className="border p-2 w-full mb-2" />
            <input name="location" value={h.location} placeholder="Location" onChange={(e) => handleChange(e, i, "underDevelopmentHotels")} className="border p-2 w-full mb-2" />
            <input name="price" value={h.price} placeholder="Price" onChange={(e) => handleChange(e, i, "underDevelopmentHotels")} className="border p-2 w-full mb-2" />
            <input name="imageUrl" value={h.imageUrl} placeholder="Image URL" onChange={(e) => handleChange(e, i, "underDevelopmentHotels")} className="border p-2 w-full mb-2" />
            <button onClick={() => removeItem("underDevelopmentHotels", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("underDevelopmentHotels")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Under Development Hotel</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Board of Directors</h2>
        <input name="title" value={form.boardOfDirectors.title} placeholder="Title" onChange={(e) => handleChange(e, null, "boardOfDirectors")} className="border p-2 w-full mb-2" />
        <textarea name="description" value={form.boardOfDirectors.description} placeholder="Description" onChange={(e) => handleChange(e, null, "boardOfDirectors")} className="border p-2 w-full mb-2" />
        <input name="buttonText" value={form.boardOfDirectors.buttonText} placeholder="Button Text" onChange={(e) => handleChange(e, null, "boardOfDirectors")} className="border p-2 w-full mb-2" />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Small Text Sections</h2>
        {form.smallTextSections.map((s, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input value={s} onChange={(e) => handleChange(e, i, "smallTextSections")} className="border p-2 w-full mb-2" />
            <button onClick={() => removeItem("smallTextSections", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("smallTextSections")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Section</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Shareholder Section</h2>
        <input name="title" value={form.shareholderSection.title} placeholder="Title" onChange={(e) => handleChange(e, null, "shareholderSection")} className="border p-2 w-full mb-2" />
        <textarea name="description" value={form.shareholderSection.description} placeholder="Description" onChange={(e) => handleChange(e, null, "shareholderSection")} className="border p-2 w-full mb-2" />
        <input name="buttonText" value={form.shareholderSection.buttonText} placeholder="Button Text" onChange={(e) => handleChange(e, null, "shareholderSection")} className="border p-2 w-full mb-2" />
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingId ? "Update Locations Page" : "Create Locations Page"}
      </button>
    </div>
  );
}
