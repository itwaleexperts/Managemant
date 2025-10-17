const express = require('express');
const router = express.Router();
const {
    getAllGroupDeals,
    createGroupDeal,
    updateGroupDeal,
    deleteGroupDeal,
    getPopularHotels,
    createPopularHotel
} = require('../../controllers/Pages/group');
const uploadImagesMiddleware = require('../../middlewares/uploadImageMiddleware');

router.get('/deals', getAllGroupDeals);
router.post('/deals', createGroupDeal);
router.put('/deals/:id', updateGroupDeal);
router.delete('/deals/:id', deleteGroupDeal);

router.get('/hotels', getPopularHotels);
router.post('/hotels',uploadImagesMiddleware, createPopularHotel);

module.exports = router;
