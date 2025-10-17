import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AdminCookiePolicy() {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ title: "Cookie Policy", sections: [] });
  const [editingId, setEditingId] = useState(null);

  const apiBase = "https://apiyatraadda.jaspersoftwaresolutions.com/api/cookie"; 

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${apiBase}/get`);
      if (res.data.success) {
        setPolicies(res.data.data);
        if (res.data.data.length > 0) {
          setForm(res.data.data[0]);
          setEditingId(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e, index, key) => {
    if (key === "section") {
      const newSections = [...form.sections];
      newSections[index][e.target.name] = e.target.value;
      setForm({ ...form, sections: newSections });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addSection = () => {
    setForm({ ...form, sections: [...form.sections, { heading: "", content: "" }] });
  };

  const removeSection = (index) => {
    const newSections = form.sections.filter((_, i) => i !== index);
    setForm({ ...form, sections: newSections });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const res = await axios.put(`${apiBase}/update/${editingId}`, form);
        alert("Policy updated successfully!");
        fetchPolicies();
      } else {
        const res = await axios.post(`${apiBase}/create`, form);
        alert("Policy created successfully!");
        fetchPolicies();
      }
    } catch (err) {
      console.error(err);
      alert("Error saving policy");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Cookie Policy Admin</h1>

      <div className="mb-4">
        <label className="block font-semibold">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Sections</h2>
        {form.sections.map((section, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input
              name="heading"
              value={section.heading}
              placeholder="Section Heading"
              onChange={(e) => handleChange(e, i, "section")}
              className="border p-2 w-full mb-2"
            />
            <textarea
              name="content"
              value={section.content}
              placeholder="Section Content"
              onChange={(e) => handleChange(e, i, "section")}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={() => removeSection(i)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              <X size={18} />
            </button>
          </div>
        ))}
        <button
          onClick={addSection}
          className="bg-green-600 text-white px-3 py-1 rounded mt-2"
        >
          + Add Section
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {editingId ? "Update Policy" : "Create Policy"}
      </button>
    </div>
  );
}
