import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPress() {
  const [pressData, setPressData] = useState([]);
  const [form, setForm] = useState({ year: "", months: [] });
  const [editingId, setEditingId] = useState(null);

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/press";

  useEffect(() => {
    fetchPress();
  }, []);

  const fetchPress = async () => {
    try {
      const res = await axios.get(`${apiUrl}/all`);
      setPressData(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
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

  const addMonth = () => {
    setForm({ ...form, months: [...form.months, { month: "", articles: [] }] });
  };

  const deleteMonth = (idx) => {
    const months = [...form.months];
    months.splice(idx, 1);
    setForm({ ...form, months });
  };

  const addArticle = (monthIdx) => {
    const months = [...form.months];
    months[monthIdx].articles.push({ title: "", source: "", url: "" });
    setForm({ ...form, months });
  };

  const deleteArticle = (monthIdx, articleIdx) => {
    const months = [...form.months];
    months[monthIdx].articles.splice(articleIdx, 1);
    setForm({ ...form, months });
  };

  const handleArticleChange = (monthIdx, articleIdx, e) => {
    const months = [...form.months];
    months[monthIdx].articles[articleIdx][e.target.name] = e.target.value;
    setForm({ ...form, months });
  };

  const submitForm = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/update/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${apiUrl}/create`, form);
      }
      setForm({ year: "", months: [] });
      fetchPress();
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  const editData = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  const deleteData = async (id) => {
    if (!window.confirm("Delete this year?")) return;
    try {
      await axios.delete(`${apiUrl}/delete/${id}`);
      fetchPress();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Press Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingId ? "Edit" : "Create"} Press Year</h2>
        <input
          name="year"
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        {form.months.map((month, mIdx) => (
          <div key={mIdx} className="border p-3 mb-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <input
                placeholder="Month"
                value={month.month}
                onChange={(e) => handleChange(e, `months.${mIdx}.month`)}
                className="border p-2 mb-2 w-1/2"
              />
              <button onClick={() => deleteMonth(mIdx)} className="bg-red-500 text-white px-2 py-1 rounded">Delete Month</button>
            </div>

            {month.articles.map((article, aIdx) => (
              <div key={aIdx} className="mb-2 border p-2 rounded">
                <input
                  placeholder="Title"
                  name="title"
                  value={article.title}
                  onChange={(e) => handleArticleChange(mIdx, aIdx, e)}
                  className="border p-1 w-full mb-1"
                />
                <input
                  placeholder="Source"
                  name="source"
                  value={article.source}
                  onChange={(e) => handleArticleChange(mIdx, aIdx, e)}
                  className="border p-1 w-full mb-1"
                />
                <input
                  placeholder="URL"
                  name="url"
                  value={article.url}
                  onChange={(e) => handleArticleChange(mIdx, aIdx, e)}
                  className="border p-1 w-full mb-1"
                />
                <button onClick={() => deleteArticle(mIdx, aIdx)} className="bg-red-500 text-white px-2 py-1 rounded">Delete Article</button>
              </div>
            ))}
            <button onClick={() => addArticle(mIdx)} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Add Article</button>
          </div>
        ))}

        <button onClick={addMonth} className="bg-blue-600 text-white px-3 py-2 rounded mb-3">Add Month</button>
        <button onClick={submitForm} className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Update" : "Create"}</button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Existing Press Years</h2>
        {pressData.map(item => (
          <div key={item._id} className="border p-3 mb-2 rounded flex justify-between items-center">
            <div>{item.year}</div>
            <div className="flex space-x-2">
              <button onClick={() => editData(item)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => deleteData(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
