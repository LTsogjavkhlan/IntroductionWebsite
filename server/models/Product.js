const { mongoose } = require('../db.js');

const productImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String, default: '' },
}, { _id: false });

const productSchema = new mongoose.Schema({
    order: { type: Number, required: true, default: 0, set: (v) => Number(v) || 0 },
    title: { type: String, required: [true, 'Гарчиг заавал шаардлагатай.'] },
    price: { type: String, default: '' },
    description: { type: String, default: '' },
    features: { type: [String], default: [] },
    category: { type: String, default: '' },
    images: { type: [productImageSchema], default: [] },
});

productSchema.index({ order: 1 });

module.exports = mongoose.model('Product', productSchema);
