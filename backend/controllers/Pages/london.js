const LondonGuide = require('../../models/Pages/londonModel');

const getAllGuides = async (req, res) => {
    try {
        const guides = await LondonGuide.find();
        res.status(200).json({ success: true, data: guides });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGuideById = async (req, res) => {
    try {
        const guide = await LondonGuide.findById(req.params.id);
        if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
        res.status(200).json(guide);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createGuide = async (req, res) => {
    try {
        const guide = await LondonGuide.create(req.body);
        res.status(201).json(guide);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateGuide = async (req, res) => {
    try {
        const guide = await LondonGuide.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
        res.status(200).json(guide);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteGuide = async (req, res) => {
    try {
        const guide = await LondonGuide.findByIdAndDelete(req.params.id);
        if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
        res.status(200).json({ success: true, message: 'Guide deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllGuides,
    getGuideById,
    createGuide,
    updateGuide,
    deleteGuide
};
