const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'NEEDS_CLEANING'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'resolved'],
        default: 'open'
    },
    consecutiveCount: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Alert', alertSchema);
