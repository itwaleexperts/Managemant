import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AdminCorporateBooking() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({
    heroTitle: "",
    heroImageUrl: "",
    introText: "",
    benefitChips: [],
    topLocations: [],
    goodToKnow: [],
  });
  const [editingId, setEditingId] = useState(null);

  const apiBase = "https://apiyatraadda.jaspersoftwaresolutions.com/api/corporate"; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiBase}/get`);
      if (res.data.success && res.data.data.length > 0) {
        setData(res.data.data[0]);
        setForm(res.data.data[0]);
        setEditingId(res.data.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e, index, type) => {
    if (type === "benefit") {
      const newArr = [...form.benefitChips];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, benefitChips: newArr });
    } else if (type === "location") {
      const newArr = [...form.topLocations];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, topLocations: newArr });
    } else if (type === "goodToKnow") {
      const newArr = [...form.goodToKnow];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, goodToKnow: newArr });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addItem = (type) => {
    if (type === "benefit") setForm({ ...form, benefitChips: [...form.benefitChips, { iconName: "", text: "" }] });
    else if (type === "location") setForm({ ...form, topLocations: [...form.topLocations, { city: "", country: "", imageUrl: "" }] });
    else if (type === "goodToKnow") setForm({ ...form, goodToKnow: [...form.goodToKnow, { question: "", answer: "" }] });
  };

  const removeItem = (type, index) => {
    if (type === "benefit") setForm({ ...form, benefitChips: form.benefitChips.filter((_, i) => i !== index) });
    else if (type === "location") setForm({ ...form, topLocations: form.topLocations.filter((_, i) => i !== index) });
    else if (type === "goodToKnow") setForm({ ...form, goodToKnow: form.goodToKnow.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiBase}/update/${editingId}`, form);
        alert("Corporate Booking data updated successfully!");
        fetchData();
      } else {
        const res = await axios.post(`${apiBase}/create`, form);
        alert("Corporate Booking data created successfully!");
        setEditingId(res.data.data._id);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Corporate Booking Admin</h1>

      <div className="mb-4">
        <label className="block font-semibold">Hero Title</label>
        <input name="heroTitle" value={form.heroTitle} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Hero Image URL</label>
        <input name="heroImageUrl" value={form.heroImageUrl} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Intro Text</label>
        <textarea name="introText" value={form.introText} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Benefit Chips</h2>
        {form.benefitChips.map((b, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input
              name="iconName"
              value={b.iconName}
              placeholder="Icon Name"
              onChange={(e) => handleChange(e, i, "benefit")}
              className="border p-2 w-full mb-2"
            />
            <input
              name="text"
              value={b.text}
              placeholder="Text"
              onChange={(e) => handleChange(e, i, "benefit")}
              className="border p-2 w-full mb-2"
            />
            <button onClick={() => removeItem("benefit", i)} className="bg-red-500 text-white px-2 py-1 rounded">
              <X size={18} />
            </button>
          </div>
        ))}
        <button onClick={() => addItem("benefit")} className="bg-green-600 text-white px-3 py-1 rounded">
          + Add Benefit
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Top Locations</h2>
        {form.topLocations.map((l, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="city" value={l.city} placeholder="City" onChange={(e) => handleChange(e, i, "location")} className="border p-2 w-full mb-2" />
            <input name="country" value={l.country} placeholder="Country" onChange={(e) => handleChange(e, i, "location")} className="border p-2 w-full mb-2" />
            <input name="imageUrl" value={l.imageUrl} placeholder="Image URL" onChange={(e) => handleChange(e, i, "location")} className="border p-2 w-full mb-2" />
            <button onClick={() => removeItem("location", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("location")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Location</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Good To Know</h2>
        {form.goodToKnow.map((q, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="question" value={q.question} placeholder="Question" onChange={(e) => handleChange(e, i, "goodToKnow")} className="border p-2 w-full mb-2" />
            <textarea name="answer" value={q.answer} placeholder="Answer" onChange={(e) => handleChange(e, i, "goodToKnow")} className="border p-2 w-full mb-2" />
            <button onClick={() => removeItem("goodToKnow", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("goodToKnow")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add FAQ</button>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingId ? "Update Corporate Booking" : "Create Corporate Booking"}
      </button>
    </div>
  );
}
