import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit3, X } from "lucide-react";

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("https://apiyatraadda.jaspersoftwaresolutions.com/api/contact");
      setContacts(res.data.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`https://apiyatraadda.jaspersoftwaresolutions.com/api/contact/${id}`);
      setContacts(contacts.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact._id);
    setForm({
      fullName: contact.fullName,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://apiyatraadda.jaspersoftwaresolutions.com/api/contact/${editingContact}`,
        form
      );
      setContacts(
        contacts.map((c) =>
          c._id === editingContact ? res.data.data : c
        )
      );
      setEditingContact(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const cancelEdit = () => {
    setEditingContact(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">📬 Contact Messages</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Message</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact._id}
                className="border-b hover:bg-gray-50 transition"
              >
                {editingContact === contact._id ? (
                  <td colSpan={5} className="p-4">
                    <form onSubmit={handleUpdate} className="grid gap-3">
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="border p-2 rounded"
                      />
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border p-2 rounded"
                      />
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        className="border p-2 rounded"
                      />
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Message"
                        className="border p-2 rounded"
                      ></textarea>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="p-3">{contact.fullName}</td>
                    <td className="p-3">{contact.email}</td>
                    <td className="p-3">{contact.subject}</td>
                    <td className="p-3">{contact.message}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
