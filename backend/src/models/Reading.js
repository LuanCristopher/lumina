const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    tensao_v: {
        type: Number,
        required: true
    },
    corrente_ma: {
        type: Number,
        required: true
    },
    luminosidade_lux: {
        type: Number,
        required: true
    },
    power_w: {
        type: Number,
        required: true
    },
    received_at: {
        type: Date,
        default: Date.now
    }
});

readingSchema.index({ device: 1, received_at: -1 });

module.exports = mongoose.model('Reading', readingSchema);
