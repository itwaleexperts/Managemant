const express = require('express');
const router = express.Router();
const {
    getAllGuides,
    getGuideById,
    createGuide,
    updateGuide,
    deleteGuide
} = require('../../controllers/Pages/london');

router.get('/', getAllGuides);
router.get('/:id', getGuideById);
router.post('/', createGuide);
router.put('/:id', updateGuide);
router.delete('/:id', deleteGuide);

module.exports = router;
