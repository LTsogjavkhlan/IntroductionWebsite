const { mongoose } = require('../db.js');

const categorySchema = new mongoose.Schema({
    order: { type: Number, required: true, default: 0, set: (v) => Number(v) || 0 },
    iconUrl: { type: String, default: '' },
    iconAlt: { type: String, default: '' },
    title: { type: String, required: [true, 'Гарчиг заавал шаардлагатай.'] },
    description: { type: String, default: '' },
    linkText: { type: String, default: 'Explore Courses' },
    linkSectionId: { type: String, required: [true, 'Хичээлийн Бүлгийн ID заавал шаардлагатай.'] },
});

categorySchema.index({ order: 1 });

module.exports = mongoose.model('Category', categorySchema);
