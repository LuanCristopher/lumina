const mongoose = require('mongoose');
const Alert = require('../models/Alert');
const Reading = require('../models/Reading');

const LUX_HIGH_THRESHOLD = 15000;
const POWER_LOW_THRESHOLD = 0.2;
const ALERT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const RESOLVE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ALERT_THRESHOLD_RATIO = 0.8; // 80%

const processReadingForAlerts = async (reading, device) => {
    try {
        const { deviceId } = reading;
        const now = new Date();

        // 1. Check if we should generate an alert
        const thirtyMinutesAgo = new Date(now.getTime() - ALERT_WINDOW_MS);

        const stats = await Reading.aggregate([
            {
                $match: {
                    device: device._id,
                    received_at: { $gte: thirtyMinutesAgo }
                }
            },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    bad: [
                        {
                            $match: {
                                luminosidade_lux: { $gte: LUX_HIGH_THRESHOLD },
                                power_w: { $lte: POWER_LOW_THRESHOLD }
                            }
                        },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const totalReadings = stats[0].total[0]?.count || 0;
        const badReadings = stats[0].bad[0]?.count || 0;
        const badRatio = totalReadings > 0 ? badReadings / totalReadings : 0;

        if (badRatio >= ALERT_THRESHOLD_RATIO && totalReadings >= 3) { // Require at least 3 readings for statistical significance
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
                    message: `Possível sujeira na placa: ${badReadings}/${totalReadings} medições (${(badRatio * 100).toFixed(0)}%) nos últimos 30 min com luz alta e potência baixa.`,
                });
                console.log(`⚠️ [ALERTA CRIADO] Device: ${deviceId} - Razão: Janela de 30min com ${badRatio.toFixed(2)} de bad readings.`);
            }
        }

        // 2. Check if we should resolve an existing alert
        const openAlertToResolve = await Alert.findOne({
            device: device._id,
            status: 'open',
            type: 'NEEDS_CLEANING'
        });

        if (openAlertToResolve) {
            const tenMinutesAgo = new Date(now.getTime() - RESOLVE_WINDOW_MS);

            // Check readings in the last 10 minutes
            const recentReadings = await Reading.find({
                device: device._id,
                received_at: { $gte: tenMinutesAgo }
            });

            if (recentReadings.length > 0) {
                const allGood = recentReadings.every(r => r.power_w > POWER_LOW_THRESHOLD);

                if (allGood) {
                    openAlertToResolve.status = 'resolved';
                    openAlertToResolve.resolvedAt = now;
                    await openAlertToResolve.save();
                    console.log(`✅ [ALERTA RESOLVIDO] Device: ${deviceId} - Potência voltou ao normal nos últimos 10 min.`);
                }
            }
        }

    } catch (error) {
        console.error("❌ Erro no alertService:", error);
        // Error in alert analysis should not break the MQTT flow
    }
};

module.exports = {
    processReadingForAlerts
};
