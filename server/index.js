require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const { connectDB } = require('./db.js');
const contactRouter = require('./routes/contact.js');
const authRouter = require('./routes/auth.js');
const contentRouter = require('./routes/content.js');
const adminHeroRouter = require('./routes/admin/hero.js');
const adminCategoriesRouter = require('./routes/admin/categories.js');
const adminCoursesRouter = require('./routes/admin/courses.js');
const adminProductsRouter = require('./routes/admin/products.js');
const adminAdviceCardsRouter = require('./routes/admin/adviceCards.js');
const requireAuth = require('./middleware/requireAuth.js');

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not set in .env');
}

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
    },
}));

app.use('/api/contact', contactRouter);
app.use('/api/admin', authRouter);
app.use('/api/content', contentRouter);
app.use('/api/admin/hero', requireAuth, adminHeroRouter);
app.use('/api/admin/categories', requireAuth, adminCategoriesRouter);
app.use('/api/admin/courses', requireAuth, adminCoursesRouter);
app.use('/api/admin/products', requireAuth, adminProductsRouter);
app.use('/api/admin/advice-cards', requireAuth, adminAdviceCardsRouter);

// Final safety net: any error forwarded via next(err) (including from
// asyncHandler-wrapped routes) lands here instead of crashing the process.
app.use((err, req, res, next) => {
    console.error('Unhandled request error:', err);
    if (res.headersSent) return next(err);

    if (err.name === 'ValidationError') {
        const firstError = Object.values(err.errors)[0];
        return res.status(400).json({
            success: false,
            message: firstError ? firstError.message : 'Оруулсан мэдээлэл буруу байна.',
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong on the server.',
    });
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`MindOra API listening on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    });
