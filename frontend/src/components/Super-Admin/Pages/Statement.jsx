import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminModernSlavery() {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({ section: "", content: "", listItems: [] });
  const [editingId, setEditingId] = useState(null);
  const [listInput, setListInput] = useState("");

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/statement";

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await axios.get(apiUrl);
      setSections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addListItem = () => {
    if (listInput.trim()) {
      setForm({ ...form, listItems: [...form.listItems, listInput] });
      setListInput("");
    }
  };

  const removeListItem = (index) => {
    const newList = form.listItems.filter((_, i) => i !== index);
    setForm({ ...form, listItems: newList });
  };

  const submitForm = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(apiUrl, form);
      }
      setForm({ section: "", content: "", listItems: [] });
      fetchSections();
    } catch (err) {
      console.error(err);
      alert("Error saving section");
    }
  };

  const editSection = (section) => {
    setForm({ section: section.section, content: section.content, listItems: section.listItems });
    setEditingId(section._id);
  };

  const deleteSection = async (id) => {
    if (!window.confirm("Delete this section?")) return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchSections();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modern Slavery Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingId ? "Edit" : "Add"} Section</h2>
        <input
          type="text"
          name="section"
          placeholder="Section Title"
          value={form.section}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <div className="mb-2">
          <input
            type="text"
            placeholder="Add list item"
            value={listInput}
            onChange={(e) => setListInput(e.target.value)}
            className="border p-2 w-2/3 mr-2"
          />
          <button
            onClick={addListItem}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
        <ul className="mb-2">
          {form.listItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center border p-2 mb-1 rounded">
              {item}
              <button
                onClick={() => removeListItem(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={submitForm}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Existing Sections</h2>
        {sections.map((s) => (
          <div
            key={s._id}
            className="border p-3 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <strong>{s.section}</strong>
              <p>{s.content}</p>
              {s.listItems && (
                <ul className="list-disc pl-5">
                  {s.listItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editSection(s)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSection(s._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
