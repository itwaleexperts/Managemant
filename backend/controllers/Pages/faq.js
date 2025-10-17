const Faq = require('../../models/Pages/faqModel');

const getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFaqsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const faqs = await Faq.find({ category });
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createFaq = async (req, res) => {
    try {
        const { category, question, answer } = req.body;
        const faq = await Faq.create({ category, question, answer });
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
        if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await Faq.findByIdAndDelete(id);
        if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });
        res.status(200).json({ success: true, message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllFaqs, getFaqsByCategory, createFaq, updateFaq, deleteFaq };
