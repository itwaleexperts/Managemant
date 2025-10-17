const { GroupDeal, PopularHotel } = require('../../models/Pages/groupModel');


const getAllGroupDeals = async (req, res) => {
    try {
        const deals = await GroupDeal.find();
        res.status(200).json(deals);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createGroupDeal = async (req, res) => {
    try {
        const deal = await GroupDeal.create(req.body);
        res.status(201).json(deal);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateGroupDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const deal = await GroupDeal.findByIdAndUpdate(id, req.body, { new: true });
        if (!deal) return res.status(404).json({ success: false, message: "Group deal not found" });
        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteGroupDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const deal = await GroupDeal.findByIdAndDelete(id);
        if (!deal) return res.status(404).json({ success: false, message: "Group deal not found" });
        res.status(200).json({ success: true, message: "Group deal deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const getPopularHotels = async (req, res) => {
    try {
        const hotels = await PopularHotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPopularHotel = async (req, res) => {
  try {
    const { name, country } = req.body;
    const images = req.files.map(f => `/uploads/${f.filename}`);

    const hotel = await PopularHotel.create({ name, country, images });

    res.status(201).json({
      success: true,
      message: "Popular hotel created successfully",
      data: hotel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
    getAllGroupDeals,
    createGroupDeal,
    updateGroupDeal,
    deleteGroupDeal,
    getPopularHotels,
    createPopularHotel
};
