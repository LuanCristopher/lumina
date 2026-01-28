const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for easier development/deployment if needed
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all to serve index.html for SPA
app.get('*all', (req, res) => {
    // If it's an API call that wasn't matched, return 404
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API Route not found' });
    }
    // Otherwise serve the frontend
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
        if (err) {
            res.status(500).send('Frontend not built yet. Run "npm run build" in frontend directory.');
        }
    });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
