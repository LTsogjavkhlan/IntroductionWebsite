const { Router } = require('express');
const HeroSlide = require('../models/HeroSlide.js');
const Category = require('../models/Category.js');
const CourseSection = require('../models/CourseSection.js');
const Course = require('../models/Course.js');
const Product = require('../models/Product.js');
const AdviceCard = require('../models/AdviceCard.js');
const asyncHandler = require('../asyncHandler.js');

const router = Router();

const VALID_PAGES = ['home', 'td', 'surgalt', 'zuwluguu'];

router.get('/:page', asyncHandler(async (req, res) => {
    const { page } = req.params;
    if (!VALID_PAGES.includes(page)) {
        return res.status(404).json({ success: false, message: 'Unknown page.' });
    }

    const hero = await HeroSlide.find({ page }).sort({ order: 1 });
    const response = { hero };

    if (page === 'surgalt') {
        const [categories, sections, courses] = await Promise.all([
            Category.find().sort({ order: 1 }),
            CourseSection.find().sort({ order: 1 }),
            Course.find().sort({ order: 1 }),
        ]);
        response.categories = categories;
        response.sections = sections;
        response.courses = courses;
    } else if (page === 'td') {
        response.products = await Product.find().sort({ order: 1 });
    } else if (page === 'zuwluguu') {
        response.adviceCards = await AdviceCard.find().sort({ order: 1 });
    }

    res.json({ success: true, ...response });
}));

module.exports = router;
