const { mongoose } = require('../db.js');

const courseSchema = new mongoose.Schema({
    sectionId: { type: String, required: [true, 'Бүлгийн ID заавал шаардлагатай.'] },
    order: { type: Number, required: true, default: 0, set: (v) => Number(v) || 0 },
    imageUrl: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    badge: { type: String, enum: ['popular', 'new', 'none'], default: 'none' },
    categoryLabel: { type: String, default: '' },
    title: { type: String, required: [true, 'Гарчиг заавал шаардлагатай.'] },
    description: { type: String, default: '' },
    linkHref: { type: String, default: '#' },
    linkText: { type: String, default: 'View Details' },
});

courseSchema.index({ sectionId: 1, order: 1 });

module.exports = mongoose.model('Course', courseSchema);
