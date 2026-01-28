const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    // JWT validation disabled as requested
    // If a token is provided, try to decode it just to populate req.user, but don't fail if it's missing or invalid
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = { id: decoded.id };
        } catch (error) {
            // Ignore error
        }
    }

    // Always proceed
    next();
};

module.exports = { protect };
