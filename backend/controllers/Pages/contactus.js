const Contact = require("../../models/Pages/contactModel");

const createContact = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;
    const contact = await Contact.create({ fullName, email, subject, message });
    res.status(201).json({ success: true, message: "Message submitted successfully!", data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, subject, message } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { fullName, email, subject, message },
      { new: true, runValidators: true }
    );

    if (!updatedContact) return res.status(404).json({ success: false, message: "Contact not found" });

    res.json({ success: true, message: "Contact updated successfully!", data: updatedContact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) return res.status(404).json({ success: false, message: "Contact not found" });

    res.json({ success: true, message: "Contact deleted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createContact, getAllContacts, updateContact, deleteContact };
