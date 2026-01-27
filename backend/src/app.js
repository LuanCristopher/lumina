const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

// Root path
app.get('/', (req, res) => {
    res.json({ message: 'Lumina API is running' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
