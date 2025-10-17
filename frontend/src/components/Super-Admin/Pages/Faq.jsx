import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Edit } from "lucide-react";

export default function AdminFaq() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ category: "", question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");

  const apiBase = "https://apiyatraadda.jaspersoftwaresolutions.com/api/faq"; 

  useEffect(() => {
    fetchFaqs();
  }, [filterCategory]);

  const fetchFaqs = async () => {
    try {
      const url = filterCategory ? `${apiBase}/category/${filterCategory}` : apiBase;
      const res = await axios.get(url);
      setFaqs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiBase}/${editingId}`, form);
        alert("FAQ updated successfully!");
      } else {
        await axios.post(apiBase, form);
        alert("FAQ created successfully!");
      }
      setForm({ category: "", question: "", answer: "" });
      setEditingId(null);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      alert("Error saving FAQ");
    }
  };

  const handleEdit = (faq) => {
    setForm({ category: faq.category, question: faq.question, answer: faq.answer });
    setEditingId(faq._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await axios.delete(`${apiBase}/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      alert("Error deleting FAQ");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">FAQ Admin</h1>

      <div className="mb-4">
        <label className="block font-semibold">Category</label>
        <input name="category" value={form.category} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Question</label>
        <input name="question" value={form.question} onChange={handleChange} className="border p-2 w-full mb-2" />

        <label className="block font-semibold">Answer</label>
        <textarea name="answer" value={form.answer} onChange={handleChange} className="border p-2 w-full mb-2" />

        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update FAQ" : "Create FAQ"}
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Filter by Category</label>
        <input
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="Type category to filter"
          className="border p-2 w-full"
        />
      </div>

      <div>
        {faqs.map((faq) => (
          <div key={faq._id} className="border p-3 mb-2 rounded flex justify-between items-start">
            <div>
              <p className="font-semibold">{faq.category}</p>
              <p className="font-bold">{faq.question}</p>
              <p>{faq.answer}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(faq)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(faq._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
