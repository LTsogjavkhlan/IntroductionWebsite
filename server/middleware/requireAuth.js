function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.status(401).json({ success: false, message: 'Authentication required.' });
}

module.exports = requireAuth;
