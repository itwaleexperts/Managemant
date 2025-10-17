import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ClubBedzzzAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    hero: { title: "", subtitle: "", img: "" },
    intro: "",
    valueProposition: "",
    membershipBenefits: [],
    howItWorks: "",
    disclaimer: "",
  });

  const baseUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/clubedzz"; 

  useEffect(() => {
    axios
      .get(baseUrl)
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
          setForm(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      hero: { ...prev.hero, [name]: value },
    }));
  };

  const addBenefit = () => {
    setForm((prev) => ({
      ...prev,
      membershipBenefits: [...prev.membershipBenefits, { title: "", description: "" }],
    }));
  };

  const handleBenefitChange = (index, e) => {
    const { name, value } = e.target;
    const newBenefits = [...form.membershipBenefits];
    newBenefits[index][name] = value;
    setForm((prev) => ({ ...prev, membershipBenefits: newBenefits }));
  };

  const removeBenefit = (index) => {
    const newBenefits = form.membershipBenefits.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, membershipBenefits: newBenefits }));
  };

  const handleSubmit = async () => {
    try {
      if (data?._id) {
        const res = await axios.put(`${baseUrl}/${data._id}`, form);
        setData(res.data.data);
        alert("ClubBedzzz data updated successfully!");
      } else {
        const res = await axios.post(baseUrl, form);
        setData(res.data.data);
        alert("ClubBedzzz data created successfully!");
      }
    } catch (err) {
      alert("Error saving data: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!data?._id) return alert("No data to delete");
    if (!window.confirm("Are you sure you want to delete this data?")) return;
    try {
      await axios.delete(`${baseUrl}/${data._id}`);
      setData(null);
      alert("ClubBedzzz data deleted successfully!");
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Manage ClubBedzzz Page</h1>

      <div className="mb-4">
        <label className="block font-semibold">Hero Title</label>
        <input
          name="title"
          value={form.hero.title}
          onChange={handleHeroChange}
          className="border p-2 w-full mb-2"
        />
        <label className="block font-semibold">Hero Subtitle</label>
        <input
          name="subtitle"
          value={form.hero.subtitle}
          onChange={handleHeroChange}
          className="border p-2 w-full mb-2"
        />
        <label className="block font-semibold">Hero Image URL</label>
        <input
          name="img"
          value={form.hero.img}
          onChange={handleHeroChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Intro</label>
        <textarea
          name="intro"
          value={form.intro}
          onChange={handleChange}
          className="border p-2 w-full"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Value Proposition</label>
        <textarea
          name="valueProposition"
          value={form.valueProposition}
          onChange={handleChange}
          className="border p-2 w-full"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Membership Benefits</h2>
          <button
            onClick={addBenefit}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            + Add Benefit
          </button>
        </div>

        {form.membershipBenefits.map((b, i) => (
          <div key={i} className="border p-3 rounded mb-3">
            <input
              name="title"
              value={b.title}
              onChange={(e) => handleBenefitChange(i, e)}
              placeholder="Benefit Title"
              className="border p-2 w-full mb-2"
            />
            <textarea
              name="description"
              value={b.description}
              onChange={(e) => handleBenefitChange(i, e)}
              placeholder="Benefit Description"
              className="border p-2 w-full mb-2"
            ></textarea>
            <button
              onClick={() => removeBenefit(i)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">How It Works</label>
        <textarea
          name="howItWorks"
          value={form.howItWorks}
          onChange={handleChange}
          className="border p-2 w-full"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block font-semibold">Disclaimer</label>
        <textarea
          name="disclaimer"
          value={form.disclaimer}
          onChange={handleChange}
          className="border p-2 w-full"
          rows="3"
        ></textarea>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {data ? "Update" : "Create"}
        </button>
        {data && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
