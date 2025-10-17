const express = require('express');
const router = express.Router();
const {
    getAllHistoryLessons,
    getHistoryLessonById,
    createHistoryLesson,
    updateHistoryLesson,
    deleteHistoryLesson
} = require('../../controllers/Pages/history');

router.get('/', getAllHistoryLessons);
router.get('/:id', getHistoryLessonById);
router.post('/', createHistoryLesson);
router.put('/:id', updateHistoryLesson);
router.delete('/:id', deleteHistoryLesson);

module.exports = router;
