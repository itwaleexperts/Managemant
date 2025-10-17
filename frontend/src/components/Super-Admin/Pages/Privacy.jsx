import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPrivacyPolicy() {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({
    lastUpdated: "",
    introduction: "",
    dataWeCollect: [],
    howWeUseData: [],
    legalRights: "",
    contact: { email: "", address: "" }
  });
  const [editingId, setEditingId] = useState(null);

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/privacy";

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${apiUrl}/all`);
      setPolicies(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e, path = null) => {
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

  const addDataCollect = () => {
    setForm({ ...form, dataWeCollect: [...form.dataWeCollect, { title: "", description: "" }] });
  };

  const deleteDataCollect = (idx) => {
    const dataWeCollect = [...form.dataWeCollect];
    dataWeCollect.splice(idx, 1);
    setForm({ ...form, dataWeCollect });
  };

  const handleDataCollectChange = (idx, e) => {
    const dataWeCollect = [...form.dataWeCollect];
    dataWeCollect[idx][e.target.name] = e.target.value;
    setForm({ ...form, dataWeCollect });
  };

  const addHowWeUseData = () => {
    setForm({ ...form, howWeUseData: [...form.howWeUseData, ""] });
  };

  const deleteHowWeUseData = (idx) => {
    const howWeUseData = [...form.howWeUseData];
    howWeUseData.splice(idx, 1);
    setForm({ ...form, howWeUseData });
  };

  const handleHowWeUseDataChange = (idx, e) => {
    const howWeUseData = [...form.howWeUseData];
    howWeUseData[idx] = e.target.value;
    setForm({ ...form, howWeUseData });
  };

  const submitForm = async () => {
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/update/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${apiUrl}/create`, form);
      }
      setForm({
        lastUpdated: "",
        introduction: "",
        dataWeCollect: [],
        howWeUseData: [],
        legalRights: "",
        contact: { email: "", address: "" }
      });
      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert("Error saving policy");
    }
  };

  const editPolicy = (policy) => {
    setForm(policy);
    setEditingId(policy._id);
  };

  const deletePolicy = async (id) => {
    if (!window.confirm("Delete this policy?")) return;
    try {
      await axios.delete(`${apiUrl}/delete/${id}`);
      fetchPolicies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy Admin</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">{editingId ? "Edit" : "Create"} Policy</h2>
        <input
          type="text"
          name="lastUpdated"
          placeholder="Last Updated"
          value={form.lastUpdated}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="introduction"
          placeholder="Introduction"
          value={form.introduction}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="legalRights"
          placeholder="Legal Rights"
          value={form.legalRights}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <h3 className="font-semibold mt-2">Data We Collect</h3>
        {form.dataWeCollect.map((item, idx) => (
          <div key={idx} className="mb-2 border p-2 rounded">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleDataCollectChange(idx, e)}
              className="border p-1 w-full mb-1"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleDataCollectChange(idx, e)}
              className="border p-1 w-full mb-1"
            />
            <button onClick={() => deleteDataCollect(idx)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        ))}
        <button onClick={addDataCollect} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Add Data Item</button>

        <h3 className="font-semibold mt-2">How We Use Data</h3>
        {form.howWeUseData.map((item, idx) => (
          <div key={idx} className="mb-2 flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleHowWeUseDataChange(idx, e)}
              className="border p-1 w-full"
            />
            <button onClick={() => deleteHowWeUseData(idx)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        ))}
        <button onClick={addHowWeUseData} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Add Usage</button>

        <h3 className="font-semibold mt-2">Contact</h3>
        <input
          type="email"
          placeholder="Email"
          value={form.contact.email}
          onChange={(e) => handleChange(e, "contact.email")}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.contact.address}
          onChange={(e) => handleChange(e, "contact.address")}
          className="border p-2 w-full mb-2"
        />

        <button onClick={submitForm} className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Update" : "Create"}</button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Existing Policies</h2>
        {policies.map((p) => (
          <div key={p._id} className="border p-3 mb-2 rounded flex justify-between items-center">
            <div>{p.lastUpdated} - {p.introduction.substring(0, 50)}...</div>
            <div className="flex space-x-2">
              <button onClick={() => editPolicy(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => deletePolicy(p._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
