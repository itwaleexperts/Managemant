import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AdminEasyHotelApp() {
  const [form, setForm] = useState({
    heroImage: "",
    heading: "",
    subHeading: "",
    googlePlayLink: "",
    appStoreLink: "",
    features: [{ icon: "", title: "", description: "" }],
  });
  const [editingId, setEditingId] = useState(null);

  const apiBase = "https://apiyatraadda.jaspersoftwaresolutions.com/api/easy"; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  const handleChange = (e, index) => {
    if (index !== undefined) {
      const newArr = [...form.features];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, features: newArr });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, { icon: "", title: "", description: "" }] });
  };

  const removeFeature = (index) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiBase}/update/${editingId}`, form);
        alert("EasyHotel App page updated successfully!");
      } else {
        const res = await axios.post(`${apiBase}/create`, form);
        setEditingId(res.data.data._id);
        alert("EasyHotel App page created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">EasyHotel App Page Admin</h1>

      <div className="mb-4">
        <label className="block font-semibold">Hero Image URL</label>
        <input name="heroImage" value={form.heroImage} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Heading</label>
        <input name="heading" value={form.heading} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Sub Heading</label>
        <input name="subHeading" value={form.subHeading} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Google Play Link</label>
        <input name="googlePlayLink" value={form.googlePlayLink} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">App Store Link</label>
        <input name="appStoreLink" value={form.appStoreLink} onChange={handleChange} className="border p-2 w-full mb-2" />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Features</h2>
        {form.features.map((f, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="icon" placeholder="Icon" value={f.icon} onChange={(e) => handleChange(e, i)} className="border p-2 w-full mb-1" />
            <input name="title" placeholder="Title" value={f.title} onChange={(e) => handleChange(e, i)} className="border p-2 w-full mb-1" />
            <textarea name="description" placeholder="Description" value={f.description} onChange={(e) => handleChange(e, i)} className="border p-2 w-full mb-1" />
            <button onClick={() => removeFeature(i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={addFeature} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Feature</button>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingId ? "Update Page" : "Create Page"}
      </button>
    </div>
  );
}
