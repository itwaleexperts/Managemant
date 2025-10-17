import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    heroTitle: "",
    introText: "",
    banner: { text: "" },
    heroImageFile: null,
    bannerImageFile: null,
  });

  const API_URL = "https://apiyatraadda.jaspersoftwaresolutions.com/api/about";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/get`);
      if (res.data.success && res.data.data) {
        const data = res.data.data;

        setAboutData(data);
        setForm({
          heroTitle: data.heroTitle || "",
          introText: data.introText || "",
          banner: { text: data.banner?.text || "" },
          heroImageFile: null,
          bannerImageFile: null,
        });
      }
    } catch (err) {
      console.log("No existing about data");
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

  const handleBannerChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, banner: { ...form.banner, [name]: value } });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.heroImageFile && !aboutData?.heroImage) {
      return alert("Please upload a Hero image.");
    }

    const formData = new FormData();
    formData.append("heroTitle", form.heroTitle);
    formData.append("introText", form.introText);
    formData.append("banner[text]", form.banner.text);

    if (form.heroImageFile) formData.append("images", form.heroImageFile);
    if (form.bannerImageFile) formData.append("images", form.bannerImageFile);

    try {
      if (aboutData?._id) {
        await axios.put(`${API_URL}/update/${aboutData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(" About page updated successfully!");
      } else {
        await axios.post(`${API_URL}/create`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(" About page created successfully!");
      }
      fetchData();
    } catch (err) {
      alert(
        " Error saving data: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async () => {
    if (!aboutData?._id) return alert("No data to delete!");
    if (!window.confirm("Are you sure you want to delete this About Page data?"))
      return;

    try {
      await axios.delete(`${API_URL}/${aboutData._id}`);
      setAboutData(null);
      setForm({
        heroTitle: "",
        introText: "",
        banner: { text: "" },
        heroImageFile: null,
        bannerImageFile: null,
      });
      alert("🗑️ Deleted successfully!");
    } catch (err) {
      alert(" Error deleting data: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        🛠️ Admin Panel – About Page
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
<div>
  <label className="block font-semibold mb-1">Hero Image</label>
  {!form.heroImageFile && aboutData?.heroImage && (
    <img
      src={`https://apiyatraadda.jaspersoftwaresolutions.com${aboutData.heroImage}`}
      alt="Hero Preview"
      className="w-full h-48 object-cover mb-2 rounded"
    />
  )}
  {form.heroImageFile && (
    <img
      src={URL.createObjectURL(form.heroImageFile)}
      alt="Hero Preview"
      className="w-full h-48 object-cover mb-2 rounded"
    />
  )}
  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setForm({ ...form, heroImageFile: e.target.files[0] })
    }
    className="border p-2 w-full rounded"
  />
</div>

<div>
  <label className="block font-semibold mb-1">Banner Image</label>
  {!form.bannerImageFile && aboutData?.banner?.image && (
    <img
      src={`https://apiyatraadda.jaspersoftwaresolutions.com${aboutData.banner.image}`}
      alt="Banner Preview"
      className="w-full h-32 object-cover mb-2 rounded"
    />
  )}
  {form.bannerImageFile && (
    <img
      src={URL.createObjectURL(form.bannerImageFile)}
      alt="Banner Preview"
      className="w-full h-32 object-cover mb-2 rounded"
    />
  )}
  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setForm({ ...form, bannerImageFile: e.target.files[0] })
    }
    className="border p-2 w-full rounded mb-2"
  />
</div>


        <div>
          <label className="block font-semibold mb-1">Hero Title</label>
          <input
            type="text"
            name="heroTitle"
            value={form.heroTitle}
            onChange={handleChange}
            placeholder="Enter hero title"
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Introduction Text</label>
          <textarea
            name="introText"
            value={form.introText}
            onChange={handleChange}
            placeholder="Enter intro text"
            className="border p-2 w-full rounded"
          />
        </div>

      <div className="mt-4 border-t pt-4">
  <h3 className="font-semibold mb-2">Banner Section</h3>

  {!form.bannerImageFile && aboutData?.banner?.image && (
    <img
      src={`https://apiyatraadda.jaspersoftwaresolutions.com${aboutData.banner.image}`}
      alt="Banner Preview"
      className="w-full h-32 object-cover mb-2 rounded"
    />
  )}

  {form.bannerImageFile && (
    <img
      src={URL.createObjectURL(form.bannerImageFile)}
      alt="Banner Preview"
      className="w-full h-32 object-cover mb-2 rounded"
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setForm({ ...form, bannerImageFile: e.target.files[0] })
    }
    className="border p-2 w-full rounded mb-2"
  />

  <input
    type="text"
    name="text"
    value={form.banner.text || ""}
    onChange={handleBannerChange}
    placeholder="Banner Text"
    className="border p-2 w-full rounded"
  />
</div>


        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {aboutData ? "Update" : "Create"}
        </button>
      </form>

      {aboutData && (
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700"
        >
          Delete About Page Data
        </button>
      )}

      {aboutData && (
        <div className="mt-10 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">📄 Current About Data</h2>
          <p>
            <strong>Hero Title:</strong> {aboutData.heroTitle}
          </p>
          <p>
            <strong>Intro:</strong> {aboutData.introText}
          </p>
          <p>
            <strong>Banner Text:</strong> {aboutData.banner?.text}
          </p>
       {aboutData.heroImage && (
  <img
    src={`https://apiyatraadda.jaspersoftwaresolutions.com${aboutData.heroImage}`}
    alt="Hero"
    className="w-full h-64 object-cover mt-3 rounded"
  />
)}

{aboutData.banner?.image && (
  <img
    src={`https://apiyatraadda.jaspersoftwaresolutions.com${aboutData.banner.image}`}
    alt="Banner"
    className="w-full h-32 object-cover mt-3 rounded"
  />
)}

        </div>
      )}
    </div>
  );
}
