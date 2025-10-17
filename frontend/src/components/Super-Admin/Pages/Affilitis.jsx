import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://apiyatraadda.jaspersoftwaresolutions.com/api/affilits"; 

export default function AffiliateAdmin() {
  const [affiliate, setAffiliate] = useState(null);
  const [form, setForm] = useState({
    hero: { brand: "", title: "", subtitle: "" },
    intro: "",
    sections: [{ heading: "", content: "" }],
    signup: { signupUrl: "", signupCode: "", programId: "" },
    paymentInfo: { currency: "GBP", paymentCycle: "Monthly" },
    contact: { email: "" },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAffiliate();
  }, []);

  const fetchAffiliate = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) {
        setAffiliate(res.data.data);
        setForm(res.data.data);
        setIsEditing(true);
      }
    } catch {
      setAffiliate(null);
    }
  };

  const handleChange = (e, path) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path ? path.split(".") : [name];
      let target = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addSection = () =>
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: "", content: "" }],
    }));

  const removeSection = (index) =>
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && affiliate?._id) {
        await axios.put(`${API_URL}/${affiliate._id}`, form);
        alert("Affiliate updated successfully ");
      } else {
        await axios.post(API_URL, form);
        alert("Affiliate created successfully ");
      }
      fetchAffiliate();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving data ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!affiliate?._id) return;
    if (!window.confirm("Delete affiliate data?")) return;
    try {
      await axios.delete(`${API_URL}/${affiliate._id}`);
      alert("Deleted successfully ");
      setAffiliate(null);
      setForm({
        hero: { brand: "", title: "", subtitle: "" },
        intro: "",
        sections: [{ heading: "", content: "" }],
        signup: { signupUrl: "", signupCode: "", programId: "" },
        paymentInfo: { currency: "GBP", paymentCycle: "Monthly" },
        contact: { email: "" },
      });
      setIsEditing(false);
    } catch (err) {
      alert("Error deleting ");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Affiliate Page Admin</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow p-6 rounded-xl"
      >
        <div>
          <h2 className="font-semibold mb-2">Hero Section</h2>
          <input
            type="text"
            placeholder="Brand"
            value={form.hero.brand}
            onChange={(e) => handleChange(e, "hero.brand")}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Title"
            value={form.hero.title}
            onChange={(e) => handleChange(e, "hero.title")}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={form.hero.subtitle}
            onChange={(e) => handleChange(e, "hero.subtitle")}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Intro</h2>
          <textarea
            value={form.intro}
            onChange={(e) => handleChange(e)}
            name="intro"
            className="border p-2 w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Sections</h2>
          {form.sections.map((s, i) => (
            <div key={i} className="border p-3 mb-2 rounded">
              <input
                type="text"
                placeholder="Heading"
                value={s.heading}
                onChange={(e) => {
                  const newSections = [...form.sections];
                  newSections[i].heading = e.target.value;
                  setForm({ ...form, sections: newSections });
                }}
                className="border p-2 w-full mb-2"
              />
              <textarea
                placeholder="Content"
                value={s.content}
                onChange={(e) => {
                  const newSections = [...form.sections];
                  newSections[i].content = e.target.value;
                  setForm({ ...form, sections: newSections });
                }}
                className="border p-2 w-full"
              />
              <button
                type="button"
                onClick={() => removeSection(i)}
                className="text-red-600 text-sm mt-1"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="text-blue-600 text-sm"
          >
            + Add Section
          </button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Signup Info</h2>
          <input
            type="text"
            placeholder="Signup URL"
            value={form.signup.signupUrl}
            onChange={(e) => handleChange(e, "signup.signupUrl")}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Signup Code"
            value={form.signup.signupCode}
            onChange={(e) => handleChange(e, "signup.signupCode")}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Program ID"
            value={form.signup.programId}
            onChange={(e) => handleChange(e, "signup.programId")}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Payment Info</h2>
          <input
            type="text"
            placeholder="Currency"
            value={form.paymentInfo.currency}
            onChange={(e) => handleChange(e, "paymentInfo.currency")}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Payment Cycle"
            value={form.paymentInfo.paymentCycle}
            onChange={(e) => handleChange(e, "paymentInfo.paymentCycle")}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Contact</h2>
          <input
            type="email"
            placeholder="Email"
            value={form.contact.email}
            onChange={(e) => handleChange(e, "contact.email")}
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
