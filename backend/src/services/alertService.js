const Alert = require('../models/Alert');

const LUX_HIGH_THRESHOLD = parseFloat(process.env.LUX_HIGH_THRESHOLD) || 10000;
const POWER_LOW_THRESHOLD = parseFloat(process.env.POWER_LOW_THRESHOLD) || 0.3;
const ALERT_CONSECUTIVE_N = parseInt(process.env.ALERT_CONSECUTIVE_N) || 3;

// Map to keep track of consecutive bad readings per device
const consecutiveBadReadings = new Map();

const processReadingForAlerts = async (reading, device) => {
    const { luminosidade_lux, power_w, deviceId } = reading;

    const isBadReading = luminosidade_lux >= LUX_HIGH_THRESHOLD && power_w <= POWER_LOW_THRESHOLD;

    if (isBadReading) {
        const currentCount = (consecutiveBadReadings.get(deviceId) || 0) + 1;
        consecutiveBadReadings.set(deviceId, currentCount);

        if (currentCount >= ALERT_CONSECUTIVE_N) {
            // Check if there's already an open alert for this device
            const openAlert = await Alert.findOne({
                device: device._id,
                status: 'open',
                type: 'NEEDS_CLEANING'
            });

            if (!openAlert) {
                await Alert.create({
                    userId: device.userId,
                    device: device._id,
                    deviceId: device.deviceId,
                    type: 'NEEDS_CLEANING',
                    message: `Luminosidade alta (${luminosidade_lux} lux) mas potência baixa (${power_w.toFixed(2)} W). A placa pode estar suja.`,
                    consecutiveCount: currentCount
                });
                console.log(`⚠️ Alerta criado para o device ${deviceId}`);
            }
        }
    } else {
        // Reset count if reading is good
        consecutiveBadReadings.set(deviceId, 0);
    }
};

module.exports = {
    processReadingForAlerts
};
