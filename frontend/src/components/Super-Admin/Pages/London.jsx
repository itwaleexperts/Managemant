import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminLondonGuides() {
  const [guides, setGuides] = useState([]);
  const [form, setForm] = useState({
    heroBanner: { imageUrl: "", title: "", subtitle: "" },
    introduction: "",
    guideSections: [],
    closingTagline: "",
    preFooter: { text: "" },
  });
  const [editingId, setEditingId] = useState(null);

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/london";

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await axios.get(apiUrl);
      setGuides(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e, path) => {
    if (!path) {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else {
      const keys = path.split(".");
      let temp = { ...form };
      let obj = temp;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = e.target.value;
      setForm(temp);
    }
  };

  const addGuideSection = () => setForm({ ...form, guideSections: [...form.guideSections, { imageUrl: "", title: "", text: "", imageOnLeft: true }] });

  const handleSectionChange = (index, e) => {
    const sections = [...form.guideSections];
    if (e.target.name === "imageOnLeft") {
      sections[index][e.target.name] = e.target.checked;
    } else {
      sections[index][e.target.name] = e.target.value;
    }
    setForm({ ...form, guideSections: sections });
  };

  const submitGuide = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(apiUrl, form);
      }
      setForm({
        heroBanner: { imageUrl: "", title: "", subtitle: "" },
        introduction: "",
        guideSections: [],
        closingTagline: "",
        preFooter: { text: "" },
      });
      fetchGuides();
    } catch (err) { console.error(err); alert("Error saving guide"); }
  };

  const editGuide = (guide) => {
    setForm(guide);
    setEditingId(guide._id);
  };

  const deleteGuide = async (id) => {
    if (!window.confirm("Delete this guide?")) return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchGuides();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">London Guides Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingId ? "Edit Guide" : "Create New Guide"}</h2>

        <input placeholder="Banner Image URL" value={form.heroBanner.imageUrl} onChange={(e) => handleChange(e, "heroBanner.imageUrl")} className="border p-2 w-full mb-2" />
        <input placeholder="Banner Title" value={form.heroBanner.title} onChange={(e) => handleChange(e, "heroBanner.title")} className="border p-2 w-full mb-2" />
        <input placeholder="Banner Subtitle" value={form.heroBanner.subtitle} onChange={(e) => handleChange(e, "heroBanner.subtitle")} className="border p-2 w-full mb-2" />

        <textarea placeholder="Introduction" value={form.introduction} onChange={(e) => handleChange(e)} name="introduction" className="border p-2 w-full mb-2" />

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Guide Sections</h3>
          {form.guideSections.map((s, idx) => (
            <div key={idx} className="mb-2 border p-2 rounded">
              <input placeholder="Image URL" name="imageUrl" value={s.imageUrl} onChange={(e) => handleSectionChange(idx, e)} className="border p-1 w-full mb-1" />
              <input placeholder="Title" name="title" value={s.title} onChange={(e) => handleSectionChange(idx, e)} className="border p-1 w-full mb-1" />
              <textarea placeholder="Text" name="text" value={s.text} onChange={(e) => handleSectionChange(idx, e)} className="border p-1 w-full mb-1" />
              <label>
                <input type="checkbox" name="imageOnLeft" checked={s.imageOnLeft} onChange={(e) => handleSectionChange(idx, e)} className="mr-1" />
                Image on Left
              </label>
            </div>
          ))}
          <button onClick={addGuideSection} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Add Section</button>
        </div>

        <input placeholder="Closing Tagline" name="closingTagline" value={form.closingTagline} onChange={(e) => handleChange(e)} className="border p-2 w-full mb-2" />
        <input placeholder="Pre-Footer Text" name="text" value={form.preFooter.text} onChange={(e) => handleChange(e, "preFooter.text")} className="border p-2 w-full mb-2" />

        <button onClick={submitGuide} className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Update Guide" : "Create Guide"}</button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Existing Guides</h2>
        {guides.map((g) => (
          <div key={g._id} className="border p-3 mb-2 rounded flex justify-between items-center">
            <div>
              <p><strong>{g.heroBanner.title}</strong></p>
              <p>{g.heroBanner.subtitle}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => editGuide(g)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => deleteGuide(g._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
