import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAccessibility() {
  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "Accessibility Statement",
    intro: "",
    digitalPolicy: { heading: "", points: [""] },
    limitations: { heading: "", points: [""] },
    compliance: "",
    preparation: "",
    contact: { email: "", address: "", phone: "" },
    technicalSpec: [""],
    focusAreas: [""],
    commitment: "",
    navigationTips: [""],
  });

  const API_URL = "https://apiyatraadda.jaspersoftwaresolutions.com/api/accessbility";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/get`);
      if (res.data.success && res.data.data) {
        setAccessData(res.data.data);
        setForm(res.data.data);
      }
    } catch {
      console.log("No existing Accessibility data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleNestedChange = (e, parent, field) => {
    const { value } = e.target;
    setForm({ ...form, [parent]: { ...form[parent], [field]: value } });
  };

  const handleArrayChange = (e, key, index) => {
    const updated = [...form[key]];
    updated[index] = e.target.value;
    setForm({ ...form, [key]: updated });
  };

  const handleNestedArrayChange = (e, parent, index) => {
    const updated = [...form[parent].points];
    updated[index] = e.target.value;
    setForm({
      ...form,
      [parent]: { ...form[parent], points: updated },
    });
  };

  const addArrayItem = (key, parent = null) => {
    if (parent) {
      setForm({
        ...form,
        [parent]: { ...form[parent], points: [...form[parent].points, ""] },
      });
    } else {
      setForm({ ...form, [key]: [...form[key], ""] });
    }
  };

  const removeArrayItem = (key, index, parent = null) => {
    if (parent) {
      const updated = form[parent].points.filter((_, i) => i !== index);
      setForm({ ...form, [parent]: { ...form[parent], points: updated } });
    } else {
      const updated = form[key].filter((_, i) => i !== index);
      setForm({ ...form, [key]: updated });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (accessData?._id) {
        await axios.put(`${API_URL}/update/${accessData._id}`, form);
        alert(" Accessibility page updated successfully!");
      } else {
        await axios.post(`${API_URL}/create`, form);
        alert(" Accessibility page created successfully!");
      }
      fetchData();
    } catch (err) {
      alert(" Error saving data: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!accessData?._id) return alert("No data to delete!");
    if (!window.confirm("Are you sure you want to delete this data?")) return;

    try {
      await axios.delete(`${API_URL}/delete/${accessData._id}`);
      setAccessData(null);
      alert("🗑️ Data deleted successfully!");
      setForm({
        title: "Accessibility Statement",
        intro: "",
        digitalPolicy: { heading: "", points: [""] },
        limitations: { heading: "", points: [""] },
        compliance: "",
        preparation: "",
        contact: { email: "", address: "", phone: "" },
        technicalSpec: [""],
        focusAreas: [""],
        commitment: "",
        navigationTips: [""],
      });
    } catch (err) {
      alert(" Error deleting data: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        🧭 Admin Panel – Accessibility Page
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Page Title"
          className="border p-2 w-full rounded"
        />

        <textarea
          name="intro"
          value={form.intro}
          onChange={handleChange}
          placeholder="Introduction Text"
          className="border p-2 w-full rounded"
        />

        <div>
          <h3 className="font-semibold">Digital Policy</h3>
          <input
            type="text"
            value={form.digitalPolicy.heading}
            onChange={(e) => handleNestedChange(e, "digitalPolicy", "heading")}
            placeholder="Heading"
            className="border p-2 w-full rounded mb-2"
          />
          {form.digitalPolicy.points.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={p}
                onChange={(e) =>
                  handleNestedArrayChange(e, "digitalPolicy", i)
                }
                placeholder={`Point ${i + 1}`}
                className="border p-2 w-full rounded"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(null, i, "digitalPolicy")}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(null, "digitalPolicy")}
            className="text-blue-600 text-sm"
          >
            + Add Point
          </button>
        </div>

        <div>
          <h3 className="font-semibold">Limitations</h3>
          <input
            type="text"
            value={form.limitations.heading}
            onChange={(e) => handleNestedChange(e, "limitations", "heading")}
            placeholder="Heading"
            className="border p-2 w-full rounded mb-2"
          />
          {form.limitations.points.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={p}
                onChange={(e) => handleNestedArrayChange(e, "limitations", i)}
                placeholder={`Point ${i + 1}`}
                className="border p-2 w-full rounded"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(null, i, "limitations")}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(null, "limitations")}
            className="text-blue-600 text-sm"
          >
            + Add Point
          </button>
        </div>

        <input
          type="text"
          name="compliance"
          value={form.compliance}
          onChange={handleChange}
          placeholder="Compliance info"
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          name="preparation"
          value={form.preparation}
          onChange={handleChange}
          placeholder="Preparation date/details"
          className="border p-2 w-full rounded"
        />

        <div>
          <h3 className="font-semibold">Contact Info</h3>
          <input
            type="email"
            value={form.contact.email}
            onChange={(e) => handleNestedChange(e, "contact", "email")}
            placeholder="Email"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="text"
            value={form.contact.address}
            onChange={(e) => handleNestedChange(e, "contact", "address")}
            placeholder="Address"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="text"
            value={form.contact.phone}
            onChange={(e) => handleNestedChange(e, "contact", "phone")}
            placeholder="Phone"
            className="border p-2 w-full rounded"
          />
        </div>

        {[
          "technicalSpec",
          "focusAreas",
          "navigationTips",
        ].map((key) => (
          <div key={key}>
            <h3 className="font-semibold capitalize">{key}</h3>
            {form[key].map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(e, key, i)}
                  placeholder={`${key} ${i + 1}`}
                  className="border p-2 w-full rounded"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(key, i)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(key)}
              className="text-blue-600 text-sm"
            >
              + Add {key}
            </button>
          </div>
        ))}

        <textarea
          name="commitment"
          value={form.commitment}
          onChange={handleChange}
          placeholder="Commitment text"
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {accessData ? "Update" : "Create"}
        </button>
      </form>

      {accessData && (
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700"
        >
          Delete Data
        </button>
      )}
    </div>
  );
}
