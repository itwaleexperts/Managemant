import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      const res = await axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/contact", formData);
      if (res.data.success) {
        setSuccess("Message submitted successfully!");
        setFormData({ fullName: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      alert("Failed to submit message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-2xl bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            {["fullName", "email", "subject", "message"].map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field === "message" ? (
                  <textarea
                    name={field}
                    rows="4"
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
            >
              {loading ? "Submitting..." : "Submit Message"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
