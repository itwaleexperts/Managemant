import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      alert("Both fields are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/super/login", {
        email,
        password,
      });

      localStorage.setItem("superAdminToken", res.data.token);

      alert(res.data.message || "Login successful!");

      setFormData({ email: "", password: "" });
      setShowModal(false);
      navigate("/super-admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] sm:w-[500px] md:w-[700px] p-8 md:p-10 relative">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Super Admin Login
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-2 rounded-lg transition`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminLogin;