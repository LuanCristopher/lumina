const mongoose = require('mongoose');
const Device = require('../models/Device');
const Reading = require('../models/Reading');

const getDevices = async (req, res) => {
    const devices = await Device.find({ userId: req.user.id });
    res.json(devices);
};

const createDevice = async (req, res) => {
    const { deviceId, name } = req.body;

    if (!deviceId) {
        res.status(400);
        throw new Error('deviceId é obrigatório');
    }

    const deviceExists = await Device.findOne({ deviceId });

    if (deviceExists) {
        res.status(400);
        throw new Error('Este deviceId já está registrado');
    }

    const device = await Device.create({
        userId: req.user.id,
        deviceId,
        name: name || deviceId
    });

    res.status(201).json(device);
};

const getReadings = async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const maxLimit = Math.min(limit, 200);

    // Ensure the device belongs to the user
    const device = await Device.findOne({ _id: req.params.id, userId: req.user.id });

    if (!device) {
        res.status(404);
        throw new Error('Device não encontrado');
    }

    const readings = await Reading.find({ device: req.params.id })
        .sort({ received_at: -1 })
        .limit(maxLimit);

    res.json(readings);
};

const getDeviceStats = async (req, res) => {
    const deviceId = req.params.id;

    // Ensure the device belongs to the user
    const device = await Device.findOne({ _id: deviceId, userId: req.user.id });

    if (!device) {
        res.status(404);
        throw new Error('Device não encontrado');
    }

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const stats = await Reading.aggregate([
        {
            $match: {
                device: new mongoose.Types.ObjectId(deviceId),
                received_at: { $gte: twoDaysAgo },
                luminosidade_lux: { $gte: 15000 }
            }
        },
        {
            $group: {
                _id: null,
                avgPower: { $avg: "$power_w" }
            }
        }
    ]);

    const avgPower = stats.length > 0 ? stats[0].avgPower : 0;

    console.log(`📊 Média de produção (2 dias) para ${device.deviceId}: ${avgPower.toFixed(2)}W`);

    res.json({
        deviceId: device.deviceId,
        avgPower2Days: avgPower
    });
};

module.exports = {
    getDevices,
    createDevice,
    getReadings,
    getDeviceStats
};
