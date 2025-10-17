const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
});

const textSectionSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
});

const bannerSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    overlayText: { type: String },
});

const historyLessonSchema = new mongoose.Schema({
    heroTitle: { type: String, required: true },
    heroBanner: bannerSchema,
    videos: [videoSchema],
    textSections: [textSectionSchema],
    callToAction: {
        title: { type: String },
        buttonText: { type: String },
    }
}, { timestamps: true });

module.exports = mongoose.model('HistoryLesson', historyLessonSchema);
