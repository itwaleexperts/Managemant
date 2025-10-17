import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminStudentDiscount() {
  const [pageData, setPageData] = useState(null);
  const [form, setForm] = useState({
    heroImage: "",
    headerText: "",
    description: "",
    discounts: [],
    poweredBy: "",
    helpCenterLink: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [discountInput, setDiscountInput] = useState({
    type: "student",
    title: "",
    description: "",
    buttonText: "",
    link: "",
    icon: "",
  });

  const apiUrl = "https://apiyatraadda.jaspersoftwaresolutions.com/api/discount";

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const res = await axios.get(apiUrl);
      setPageData(res.data.data);
      setForm(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDiscountChange = (e) => {
    setDiscountInput({ ...discountInput, [e.target.name]: e.target.value });
  };

  const addDiscount = () => {
    setForm({ ...form, discounts: [...form.discounts, discountInput] });
    setDiscountInput({
      type: "student",
      title: "",
      description: "",
      buttonText: "",
      link: "",
      icon: "",
    });
  };

  const editDiscount = (index) => {
    setDiscountInput(form.discounts[index]);
    setEditingIndex(index);
  };

  const updateDiscount = () => {
    const newDiscounts = [...form.discounts];
    newDiscounts[editingIndex] = discountInput;
    setForm({ ...form, discounts: newDiscounts });
    setDiscountInput({
      type: "student",
      title: "",
      description: "",
      buttonText: "",
      link: "",
      icon: "",
    });
    setEditingIndex(null);
  };

  const removeDiscount = (index) => {
    const newDiscounts = form.discounts.filter((_, i) => i !== index);
    setForm({ ...form, discounts: newDiscounts });
  };

  const submitForm = async () => {
    try {
      if (pageData?._id) {
        await axios.put(`${apiUrl}/${pageData._id}`, form);
      } else {
        await axios.post(apiUrl, form);
      }
      fetchPage();
      alert("Page saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving page");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Discount Admin</h1>

      <div className="mb-6 border p-4 rounded">
        <h2 className="font-semibold mb-2">Page Details</h2>
        <input
          type="text"
          name="heroImage"
          placeholder="Hero Image URL"
          value={form.heroImage || ""}
          onChange={handleFormChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="headerText"
          placeholder="Header Text"
          value={form.headerText || ""}
          onChange={handleFormChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleFormChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="poweredBy"
          placeholder="Powered By"
          value={form.poweredBy || ""}
          onChange={handleFormChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="helpCenterLink"
          placeholder="Help Center Link"
          value={form.helpCenterLink || ""}
          onChange={handleFormChange}
          className="border p-2 w-full mb-2"
        />
      </div>

      <div className="mb-6 border p-4 rounded">
        <h2 className="font-semibold mb-2">{editingIndex !== null ? "Edit Discount" : "Add Discount"}</h2>
        <select
          name="type"
          value={discountInput.type}
          onChange={handleDiscountChange}
          className="border p-2 w-full mb-2"
        >
          <option value="student">Student</option>
          <option value="graduate">Graduate</option>
        </select>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={discountInput.title}
          onChange={handleDiscountChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={discountInput.description}
          onChange={handleDiscountChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="buttonText"
          placeholder="Button Text"
          value={discountInput.buttonText}
          onChange={handleDiscountChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={discountInput.link}
          onChange={handleDiscountChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="icon"
          placeholder="Icon URL"
          value={discountInput.icon}
          onChange={handleDiscountChange}
          className="border p-2 w-full mb-2"
        />

        {editingIndex !== null ? (
          <button
            onClick={updateDiscount}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update Discount
          </button>
        ) : (
          <button
            onClick={addDiscount}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Discount
          </button>
        )}
      </div>

      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Existing Discounts</h2>
        {form.discounts.map((d, index) => (
          <div key={index} className="border p-2 mb-2 rounded flex justify-between items-center">
            <div>
              <strong>{d.title}</strong> ({d.type})
              <p>{d.description}</p>
              <small>{d.buttonText} - {d.link}</small>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editDiscount(index)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => removeDiscount(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={submitForm}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Save Page
      </button>
    </div>
  );
}
