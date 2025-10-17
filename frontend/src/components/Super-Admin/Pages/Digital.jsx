import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AdminDigitalKey() {
  const [form, setForm] = useState({
    heroTitle: "",
    heroImageUrls: [""],
    introText: "",
    features: [{ iconName: "", title: "", description: "" }],
    setupGuide: { title: "", description: "", imageUrl: "", extraInfo: [] },
    faq: [{ question: "", answer: "" }]
  });
  const [editingId, setEditingId] = useState(null);

  const apiBase = "https://apiyatraadda.jaspersoftwaresolutions.com/api/digital"; 

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

  const handleChange = (e, index, type, subType) => {
    if (type === "heroImageUrls") {
      const newArr = [...form.heroImageUrls];
      newArr[index] = e.target.value;
      setForm({ ...form, heroImageUrls: newArr });
    } else if (type === "features") {
      const newArr = [...form.features];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, features: newArr });
    } else if (type === "faq") {
      const newArr = [...form.faq];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, faq: newArr });
    } else if (type === "setupGuideExtra") {
      const newArr = [...form.setupGuide.extraInfo];
      newArr[index][e.target.name] = e.target.value;
      setForm({ ...form, setupGuide: { ...form.setupGuide, extraInfo: newArr } });
    } else if (type === "setupGuide") {
      setForm({ ...form, setupGuide: { ...form.setupGuide, [e.target.name]: e.target.value } });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addItem = (type) => {
    if (type === "heroImageUrls") setForm({ ...form, heroImageUrls: [...form.heroImageUrls, ""] });
    else if (type === "features") setForm({ ...form, features: [...form.features, { iconName: "", title: "", description: "" }] });
    else if (type === "faq") setForm({ ...form, faq: [...form.faq, { question: "", answer: "" }] });
    else if (type === "setupGuideExtra") setForm({ ...form, setupGuide: { ...form.setupGuide, extraInfo: [...form.setupGuide.extraInfo, { iconName: "", text: "" }] } });
  };

  const removeItem = (type, index) => {
    if (type === "heroImageUrls") setForm({ ...form, heroImageUrls: form.heroImageUrls.filter((_, i) => i !== index) });
    else if (type === "features") setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
    else if (type === "faq") setForm({ ...form, faq: form.faq.filter((_, i) => i !== index) });
    else if (type === "setupGuideExtra") setForm({ ...form, setupGuide: { ...form.setupGuide, extraInfo: form.setupGuide.extraInfo.filter((_, i) => i !== index) } });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiBase}/update/${editingId}`, form);
        alert("DigitalKey page updated successfully!");
      } else {
        const res = await axios.post(`${apiBase}/create`, form);
        setEditingId(res.data.data._id);
        alert("DigitalKey page created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">DigitalKey Page Admin</h1>

      <div className="mb-4">
        <label className="block font-semibold">Hero Title</label>
        <input name="heroTitle" value={form.heroTitle} onChange={handleChange} className="border p-2 w-full mb-2" />
        <label className="block font-semibold">Hero Images</label>
        {form.heroImageUrls.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={img} onChange={(e) => handleChange(e, i, "heroImageUrls")} className="border p-2 w-full" />
            <button onClick={() => removeItem("heroImageUrls", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("heroImageUrls")} className="bg-green-600 text-white px-3 py-1 rounded mb-2">+ Add Image</button>
        <label className="block font-semibold">Intro Text</label>
        <textarea name="introText" value={form.introText} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Features</h2>
        {form.features.map((f, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="iconName" placeholder="Icon Name" value={f.iconName} onChange={(e) => handleChange(e, i, "features")} className="border p-2 w-full mb-1" />
            <input name="title" placeholder="Title" value={f.title} onChange={(e) => handleChange(e, i, "features")} className="border p-2 w-full mb-1" />
            <textarea name="description" placeholder="Description" value={f.description} onChange={(e) => handleChange(e, i, "features")} className="border p-2 w-full mb-1" />
            <button onClick={() => removeItem("features", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("features")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Feature</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Setup Guide</h2>
        <input name="title" placeholder="Title" value={form.setupGuide.title} onChange={(e) => handleChange(e, null, "setupGuide")} className="border p-2 w-full mb-1" />
        <textarea name="description" placeholder="Description" value={form.setupGuide.description} onChange={(e) => handleChange(e, null, "setupGuide")} className="border p-2 w-full mb-1" />
        <input name="imageUrl" placeholder="Image URL" value={form.setupGuide.imageUrl} onChange={(e) => handleChange(e, null, "setupGuide")} className="border p-2 w-full mb-1" />

        <h3 className="font-semibold mt-2">Extra Info</h3>
        {form.setupGuide.extraInfo.map((ex, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input name="iconName" placeholder="Icon Name" value={ex.iconName} onChange={(e) => handleChange(e, i, "setupGuideExtra")} className="border p-2 w-full" />
            <input name="text" placeholder="Text" value={ex.text} onChange={(e) => handleChange(e, i, "setupGuideExtra")} className="border p-2 w-full" />
            <button onClick={() => removeItem("setupGuideExtra", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("setupGuideExtra")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Extra Info</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">FAQ</h2>
        {form.faq.map((f, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input name="question" placeholder="Question" value={f.question} onChange={(e) => handleChange(e, i, "faq")} className="border p-2 w-full mb-1" />
            <textarea name="answer" placeholder="Answer" value={f.answer} onChange={(e) => handleChange(e, i, "faq")} className="border p-2 w-full mb-1" />
            <button onClick={() => removeItem("faq", i)} className="bg-red-500 text-white px-2 py-1 rounded"><X size={18} /></button>
          </div>
        ))}
        <button onClick={() => addItem("faq")} className="bg-green-600 text-white px-3 py-1 rounded">+ Add FAQ</button>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingId ? "Update DigitalKey Page" : "Create DigitalKey Page"}
      </button>
    </div>
  );
}
