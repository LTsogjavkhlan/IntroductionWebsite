const { mongoose } = require('../db.js');

const adviceCardSchema = new mongoose.Schema({
    order: { type: Number, required: true, default: 0, set: (v) => Number(v) || 0 },
    iconSvgPath: { type: String, default: '' },
    title: { type: String, required: [true, 'Гарчиг заавал шаардлагатай.'] },
    content: { type: String, default: '' },
    linkText: { type: String, default: 'Learn More' },
    studyTitle: { type: String, default: '' },
    studyContent: { type: String, default: '' },
    studyLink: { type: String, default: '#' },
});

adviceCardSchema.index({ order: 1 });

module.exports = mongoose.model('AdviceCard', adviceCardSchema);
