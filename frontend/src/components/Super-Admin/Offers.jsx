import React, { useState, useEffect } from "react";
import axios from "axios";

export default function OfferAdmin() {
  const [offersList, setOffersList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    mainHeading: "",
    subHeading: "",
    offers: [{ img: "", title: "", desc: "", btnText: "", file: null }],
    extraSection: {
      heading: "",
      subText: "",
      leftImage: "",
      leftFile: null,
      leftTitle: "",
      leftDesc: "",
      leftBtnText: "",
      rightTitle: "",
      rightDesc: "",
      rightBtnText: "",
      rightImage: "",
      rightFile: null,
    },
  });

  const token = localStorage.getItem("adminToken");

  const fetchOffers = async () => {
    try {
      const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/deals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffersList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOfferChange = (index, e) => {
    const updatedOffers = [...formData.offers];
    if (e.target.name === "file") {
      updatedOffers[index].file = e.target.files[0];
      updatedOffers[index].img = URL.createObjectURL(e.target.files[0]);
    } else updatedOffers[index][e.target.name] = e.target.value;

    setFormData({ ...formData, offers: updatedOffers });
  };

  const handleExtraChange = (e) =>
    setFormData({
      ...formData,
      extraSection: { ...formData.extraSection, [e.target.name]: e.target.value },
    });

  const handleAddOffer = () =>
    setFormData({
      ...formData,
      offers: [...formData.offers, { img: "", title: "", desc: "", btnText: "", file: null }],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("mainHeading", formData.mainHeading);
      payload.append("subHeading", formData.subHeading);

      payload.append("offers", JSON.stringify(formData.offers.map(({ file, img, ...o }) => o)));

      formData.offers.forEach((o) => {
        if (o.file) payload.append("offerImages", o.file); 
      });

      if (formData.extraSection.leftFile)
        payload.append("leftImage", formData.extraSection.leftFile);
      if (formData.extraSection.rightFile)
        payload.append("rightImage", formData.extraSection.rightFile);

      Object.keys(formData.extraSection).forEach((key) => {
        if (!key.includes("File") && !key.includes("Image")) {
          payload.append(`extraSection[${key}]`, formData.extraSection[key]);
        }
      });

      if (editingId) {
        await axios.put(`https://apiyatraadda.jaspersoftwaresolutions.com/api/deals/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/deals", payload, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
      }

      alert("Saved successfully");
      setEditingId(null);
      setFormData({
        mainHeading: "",
        subHeading: "",
        offers: [{ img: "", title: "", desc: "", btnText: "", file: null }],
        extraSection: {
          heading: "",
          subText: "",
          leftImage: "",
          leftFile: null,
          leftTitle: "",
          leftDesc: "",
          leftBtnText: "",
          rightTitle: "",
          rightDesc: "",
          rightBtnText: "",
          rightImage: "",
          rightFile: null,
        },
      });
      fetchOffers();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`https://apiyatraadda.jaspersoftwaresolutions.com/api/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        ...res.data,
        offers: res.data.offers.map((o) => ({ ...o, file: null })),
        extraSection: {
          ...res.data.extraSection,
          leftFile: null,
          rightFile: null,
        },
      });
      setEditingId(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">{editingId ? "Edit" : "Create"} Offer Page</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="mainHeading"
          placeholder="Main Heading"
          value={formData.mainHeading}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="subHeading"
          placeholder="Sub Heading"
          value={formData.subHeading}
          onChange={handleChange}
        />

        <h3 className="text-xl font-semibold">Offers</h3>
        {formData.offers.map((offer, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center gap-3 border p-3 rounded mb-2">
            <input
              type="file"
              name="file"
              onChange={(e) => handleOfferChange(i, e)}
              className="md:w-1/4"
            />
            {offer.img && <img src={offer.img} alt="preview" className="w-24 h-16 object-cover rounded" />}
            <input
              className="flex-1 p-2 border rounded"
              type="text"
              name="title"
              placeholder="Title"
              value={offer.title}
              onChange={(e) => handleOfferChange(i, e)}
              required
            />
            <input
              className="flex-1 p-2 border rounded"
              type="text"
              name="desc"
              placeholder="Description"
              value={offer.desc}
              onChange={(e) => handleOfferChange(i, e)}
              required
            />
            <input
              className="flex-1 p-2 border rounded"
              type="text"
              name="btnText"
              placeholder="Button Text"
              value={offer.btnText}
              onChange={(e) => handleOfferChange(i, e)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOffer}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Another Offer
        </button>

        <h3 className="text-xl font-semibold mt-4">Extra Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-3 rounded shadow space-y-2">
            <h4 className="font-semibold text-center">Left Section</h4>
            <input
              type="text"
              name="leftTitle"
              placeholder="Title"
              value={formData.extraSection.leftTitle}
              onChange={handleExtraChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="leftDesc"
              placeholder="Description"
              value={formData.extraSection.leftDesc}
              onChange={handleExtraChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="leftBtnText"
              placeholder="Button Text"
              value={formData.extraSection.leftBtnText}
              onChange={handleExtraChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              name="leftImage"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({
                  ...formData,
                  extraSection: {
                    ...formData.extraSection,
                    leftImage: URL.createObjectURL(file),
                    leftFile: file,
                  },
                });
              }}
              className="w-full"
            />
            {formData.extraSection.leftImage && (
              <img
                src={formData.extraSection.leftImage}
                alt="Left Preview"
                className="w-full h-32 object-cover rounded"
              />
            )}
          </div>

          <div className="border p-3 rounded shadow space-y-2">
            <h4 className="font-semibold text-center">Right Section</h4>
            <input
              type="text"
              name="rightTitle"
              placeholder="Title"
              value={formData.extraSection.rightTitle}
              onChange={handleExtraChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="rightDesc"
              placeholder="Description"
              value={formData.extraSection.rightDesc}
              onChange={handleExtraChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="rightBtnText"
              placeholder="Button Text"
              value={formData.extraSection.rightBtnText}
              onChange={handleExtraChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              name="rightImage"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({
                  ...formData,
                  extraSection: {
                    ...formData.extraSection,
                    rightImage: URL.createObjectURL(file),
                    rightFile: file,
                  },
                });
              }}
              className="w-full"
            />
            {formData.extraSection.rightImage && (
              <img
                src={formData.extraSection.rightImage}
                alt="Right Preview"
                className="w-full h-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-2"
        >
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      <h2 className="text-2xl font-bold text-center mb-4">All Offer Pages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {Array.isArray(offersList) && offersList.length > 0 ? (
  offersList.map((offer) => (
    <div key={offer._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h3 className="text-lg font-bold">{offer.mainHeading}</h3>
      <p className="text-gray-600 mb-2">{offer.subHeading}</p>

      {offer.offers?.map((o, idx) => (
        <div key={idx} className="mb-2">
          {o.img && (
            <img
              src={`https://apiyatraadda.jaspersoftwaresolutions.com/${o.img}`}
              alt="offer"
              className="w-full h-32 object-cover rounded mb-1"
            />
          )}
          <p className="font-semibold">{o.title}</p>
          <p className="text-gray-600 text-sm">{o.desc}</p>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => handleEdit(offer._id)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(offer._id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  ))
) : (
  <p className="text-gray-500">No offers found</p>
)}

      </div>
    </div>
  );
}
