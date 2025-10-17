const express = require('express');
const router = express.Router();
const {
  getAllSustainability,
  getSustainabilityById,
  createSustainability,
  updateSustainability,
  deleteSustainability
} = require('../../controllers/Pages/pledge');

router.get('/', getAllSustainability);
router.get('/:id', getSustainabilityById);
router.post('/', createSustainability);
router.put('/:id', updateSustainability);
router.delete('/:id', deleteSustainability);

module.exports = router;
