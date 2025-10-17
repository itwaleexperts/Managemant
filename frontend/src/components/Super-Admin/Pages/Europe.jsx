import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AdminEuropeTravelGuide() {
  const [form, setForm] = useState({
    heroImage: "",
    heroTitle: "",
    heroSubtitle: "",
    guideSections: [{ imageUrl: "", title: "", text: "", imageOnLeft: true }],
    closingBannerText: "",
  });
  const [editingId, setEditingId] = useState(null);

  const apiBase = "https://apiyatraadda.jaspersoftwaresolutions.com/api/europe"; 

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
      const newArr = [...form.guideSections];
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      newArr[index][e.target.name] = value;
      setForm({ ...form, guideSections: newArr });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addSection = () => {
    setForm({
      ...form,
      guideSections: [...form.guideSections, { imageUrl: "", title: "", text: "", imageOnLeft: true }],
    });
  };

  const removeSection = (index) => {
    setForm({
      ...form,
      guideSections: form.guideSections.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiBase}/update/${editingId}`, form);
        alert("Europe Travel Guide updated successfully!");
      } else {
        const res = await axios.post(`${apiBase}/create`, form);
        setEditingId(res.data.data._id);
        alert("Europe Travel Guide created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Europe Travel Guide Admin</h1>

      <div className="mb-4">
        <label className="block font-semibold">Hero Image URL</label>
        <input name="heroImage" value={form.heroImage} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Hero Title</label>
        <input name="heroTitle" value={form.heroTitle} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Hero Subtitle</label>
        <input name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Closing Banner Text</label>
        <input name="closingBannerText" value={form.closingBannerText} onChange={handleChange} className="border p-2 w-full mb-2" />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Guide Sections</h2>
        {form.guideSections.map((section, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="imageUrl" placeholder="Image URL" value={section.imageUrl} onChange={(e) => handleChange(e, i)} className="border p-2 w-full mb-1" />
            <input name="title" placeholder="Title" value={section.title} onChange={(e) => handleChange(e, i)} className="border p-2 w-full mb-1" />
            <textarea name="text" placeholder="Text" value={section.text} onChange={(e) => handleChange(e, i)} className="border p-2 w-full mb-1" />
            <label className="flex items-center mb-1">
              <input type="checkbox" name="imageOnLeft" checked={section.imageOnLeft} onChange={(e) => handleChange(e, i)} className="mr-2" />
              Image on Left
            </label>
            <button onClick={() => removeSection(i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={addSection} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Section</button>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingId ? "Update Page" : "Create Page"}
      </button>
    </div>
  );
}
