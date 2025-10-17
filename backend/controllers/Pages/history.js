const HistoryLesson = require('../../models/Pages/historyModel');

const getAllHistoryLessons = async (req, res) => {
  try {
    const lessons = await HistoryLesson.find();
    if (!lessons.length) return res.status(404).json({ message: "No lessons found" });
    res.status(200).json(lessons[0]); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getHistoryLessonById = async (req, res) => {
    try {
        const lesson = await HistoryLesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createHistoryLesson = async (req, res) => {
    try {
        const lesson = await HistoryLesson.create(req.body);
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateHistoryLesson = async (req, res) => {
    try {
        const lesson = await HistoryLesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteHistoryLesson = async (req, res) => {
    try {
        const lesson = await HistoryLesson.findByIdAndDelete(req.params.id);
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.status(200).json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllHistoryLessons,
    getHistoryLessonById,
    createHistoryLesson,
    updateHistoryLesson,
    deleteHistoryLesson
};
