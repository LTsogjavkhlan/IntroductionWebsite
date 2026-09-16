const { mongoose } = require('../db.js');

const heroSlideSchema = new mongoose.Schema({
    page: { type: String, required: [true, 'Хуудас заавал шаардлагатай.'], enum: ['home', 'td', 'surgalt', 'zuwluguu'] },
    order: { type: Number, required: true, default: 0, set: (v) => Number(v) || 0 },
    title: { type: String, required: [true, 'Гарчиг заавал шаардлагатай.'] },
    body: { type: String, default: '' },
    ctaLabel: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
});

heroSlideSchema.index({ page: 1, order: 1 });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
