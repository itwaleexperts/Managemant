import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSustainability() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    hero: { imageUrl: "", heading: "" },
    introText: "",
    currentActions: [],
    committeeMembers: [],
    pastProjects: [],
    futurePlans: [],
    ctaButtons: []
  });
  const [editingId, setEditingId] = useState(null);

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/pledge";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(apiUrl);
      setData(res.data.data || []);
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

  const addArrayItem = (key, template) => {
    setForm({ ...form, [key]: [...form[key], template] });
  };

  const handleArrayChange = (key, index, e) => {
    const arr = [...form[key]];
    arr[index][e.target.name] = e.target.value;
    setForm({ ...form, [key]: arr });
  };

  const deleteArrayItem = (key, index) => {
    const arr = [...form[key]];
    arr.splice(index, 1);
    setForm({ ...form, [key]: arr });
  };

  const submitForm = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(apiUrl, form);
      }
      setForm({
        hero: { imageUrl: "", heading: "" },
        introText: "",
        currentActions: [],
        committeeMembers: [],
        pastProjects: [],
        futurePlans: [],
        ctaButtons: []
      });
      fetchData();
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
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sustainability Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingId ? "Edit" : "Create"} Sustainability Page</h2>

        <input placeholder="Hero Image URL" value={form.hero.imageUrl} onChange={(e) => handleChange(e, "hero.imageUrl")} className="border p-2 w-full mb-2" />
        <input placeholder="Hero Heading" value={form.hero.heading} onChange={(e) => handleChange(e, "hero.heading")} className="border p-2 w-full mb-2" />

        <textarea placeholder="Intro Text" name="introText" value={form.introText} onChange={handleChange} className="border p-2 w-full mb-2" />

        {["currentActions","committeeMembers","pastProjects","futurePlans","ctaButtons"].map(section => (
          <div key={section} className="mb-4">
            <h3 className="font-semibold mb-2">{section}</h3>
            {form[section].map((item, idx) => (
              <div key={idx} className="mb-2 border p-2 rounded">
                {Object.keys(item).map(field => (
                  <input
                    key={field}
                    placeholder={field}
                    name={field}
                    value={item[field]}
                    onChange={(e) => handleArrayChange(section, idx, e)}
                    className="border p-1 w-full mb-1"
                  />
                ))}
                <button onClick={() => deleteArrayItem(section, idx)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </div>
            ))}
            <button onClick={() => addArrayItem(section, Object.keys(form[section][0] || {title:"",description:"",imageUrl:""}).reduce((acc,k)=>({...acc,[k]:""}),{}))} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Add {section}</button>
          </div>
        ))}

        <button onClick={submitForm} className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Update" : "Create"}</button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Existing Pages</h2>
        {data.map(item => (
          <div key={item._id} className="border p-3 mb-2 rounded flex justify-between items-center">
            <div>{item.hero.heading}</div>
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
