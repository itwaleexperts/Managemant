const express = require('express');
const router = express.Router();
const {
    getAllFaqs,
    getFaqsByCategory,
    createFaq,
    updateFaq,
    deleteFaq
} = require('../../controllers/Pages/faq');

router.get('/', getAllFaqs);
router.get('/:category', getFaqsByCategory);
router.post('/', createFaq);
router.put('/:id', updateFaq);
router.delete('/:id', deleteFaq);

module.exports = router;
