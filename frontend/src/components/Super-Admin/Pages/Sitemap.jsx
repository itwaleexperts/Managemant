import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSitemap() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ column: "", link: "" });
  const [editingId, setEditingId] = useState(null);

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/sitemap";

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get(apiUrl);
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(apiUrl, form);
      }
      setForm({ column: "", link: "" });
      fetchLinks();
    } catch (err) {
      console.error(err);
      alert("Error saving link");
    }
  };

  const editLink = (link) => {
    setForm({ column: link.column, link: link.link });
    setEditingId(link._id);
  };

  const deleteLink = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sitemap Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingId ? "Edit" : "Add"} Link</h2>
        <input
          type="text"
          name="column"
          placeholder="Column Name"
          value={form.column}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="link"
          placeholder="Link URL"
          value={form.link}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={submitForm}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Existing Links</h2>
        {links.map((l) => (
          <div
            key={l._id}
            className="border p-3 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <strong>{l.column}:</strong> {l.link}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editLink(l)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteLink(l._id)}
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
