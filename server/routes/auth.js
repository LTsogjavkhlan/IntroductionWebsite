const { Router } = require('express');
const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser.js');
const asyncHandler = require('../asyncHandler.js');

const router = Router();

router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Нэвтрэх нэр болон нууц үгээ оруулна уу.' });
    }

    const admin = await AdminUser.findOne({ username });
    if (!admin) {
        return res.status(401).json({ success: false, message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна.' });
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) {
        return res.status(401).json({ success: false, message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна.' });
    }

    await new Promise((resolve, reject) => {
        req.session.regenerate((err) => (err ? reject(err) : resolve()));
    });
    req.session.isAdmin = true;
    req.session.username = admin.username;
    await new Promise((resolve, reject) => {
        req.session.save((err) => (err ? reject(err) : resolve()));
    });
    res.json({ success: true, username: admin.username });
}));

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

router.get('/me', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.json({ success: true, username: req.session.username });
    }
    res.status(401).json({ success: false });
});

module.exports = router;
