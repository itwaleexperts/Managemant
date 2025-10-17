const mongoose = require('mongoose');

const groupDealSchema = new mongoose.Schema({
    name: { type: String, required: true },            
    email: { type: String, required: true },
    phone: { type: String },
    hotel: { type: String },                          
    rooms: { type: Number, required: true },          
    message: { type: String },                         
}, { timestamps: true });

const popularHotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    images: [{ type: String }],
});

module.exports = {
    GroupDeal: mongoose.model('GroupDeal', groupDealSchema),
    PopularHotel: mongoose.model('PopularHotel', popularHotelSchema)
};
