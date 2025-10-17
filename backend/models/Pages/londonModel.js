const mongoose = require('mongoose');

const imageTextBlockSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    imageOnLeft: { type: Boolean, default: true }
});

const bannerSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String }
});

const preFooterSchema = new mongoose.Schema({
    text: { type: String, required: true }
});

const londonGuideSchema = new mongoose.Schema({
    heroBanner: bannerSchema,
    introduction: { type: String },
    guideSections: [imageTextBlockSchema],
    closingTagline: { type: String },
    preFooter: preFooterSchema
}, { timestamps: true });

module.exports = mongoose.model('LondonGuide', londonGuideSchema);
