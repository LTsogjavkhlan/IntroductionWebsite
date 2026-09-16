const { mongoose } = require('../db.js');

const courseSectionSchema = new mongoose.Schema({
    sectionId: { type: String, required: [true, 'Бүлгийн ID заавал шаардлагатай.'], unique: true },
    order: { type: Number, required: true, default: 0, set: (v) => Number(v) || 0 },
    title: { type: String, required: [true, 'Гарчиг заавал шаардлагатай.'] },
    description: { type: String, default: '' },
    colorVariant: { type: String, default: '' },
});

module.exports = mongoose.model('CourseSection', courseSectionSchema);
