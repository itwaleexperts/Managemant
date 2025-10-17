import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const ManageAdmins = () => {
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [editAdminId, setEditAdminId] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/admin/all");
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      alert("Failed to fetch admins");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, password } = formData;
    if (!name || !email || (!password && !editAdminId)) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (editAdminId) {
        const res = await axios.put(
          `https://apiyatraadda.jaspersoftwaresolutions.com/api/admin/update/${editAdminId}`,
          { name, email, ...(password && { password }) }
        );
        setAdmins((prev) =>
          prev.map((admin) => (admin._id === editAdminId ? res.data.admin : admin))
        );
        alert("Admin updated successfully!");
      } else {
        const res = await axios.post("https://apiyatraadda.jaspersoftwaresolutions.com/api/admin/register", { name, email, password });
        setAdmins((prev) => [...prev, res.data.data]);
        alert("Admin registered successfully!");
      }

      setFormData({ name: "", email: "", password: "" });
      setEditAdminId(null);
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/admin/delete/${adminId}`);
      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
      alert("Admin deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleEdit = (admin) => {
    setFormData({ name: admin.name, email: admin.email, password: "" });
    setEditAdminId(admin._id);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Admins</h2>
        <button
          onClick={() => { setFormData({ name: "", email: "", password: "" }); setEditAdminId(null); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Create Admin
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 p-6 italic">
                  No admins available. Please create one.
                </td>
              </tr>
            ) : (
              admins.map((admin, index) => (
                <tr key={admin._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{admin.name}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button className="text-green-600 hover:text-green-800" onClick={() => handleEdit(admin)}>
                      <FaEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(admin._id)}>
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-[600px] p-8 relative">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              {editAdminId ? "Edit Admin" : "Create New Admin"}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Password {editAdminId ? "(Leave blank to keep current)" : ""}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${
                  loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-5 py-2 rounded-lg`}
              >
                {loading ? (editAdminId ? "Updating..." : "Registering...") : (editAdminId ? "Update Admin" : "Register Admin")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;