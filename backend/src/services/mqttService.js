const mqtt = require('mqtt');
const Device = require('../models/Device');
const Reading = require('../models/Reading');
const alertService = require('./alertService');

const connectMQTT = () => {
    const mqttClient = mqtt.connect(process.env.MQTT_HOST, {
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASS,
        port: process.env.MQTT_PORT,
        protocol: 'mqtts',
        rejectUnauthorized: false // HiveMQ Cloud sometimes needs this if CA is not provided
    });

    mqttClient.on('connect', () => {
        console.log("✅ Conectado ao HiveMQ Cloud via TLS!");
        mqttClient.subscribe(process.env.MQTT_TOPIC, (err) => {
            if (!err) {
                console.log(`📡 Inscrito no tópico: ${process.env.MQTT_TOPIC}`);
            } else {
                console.error("❌ Erro ao inscrever no tópico:", err);
            }
        });
    });

    mqttClient.on('message', async (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
            const { device_id, tensao_v, corrente_ma, luminosidade_lux } = payload;

            if (!device_id) return;

            // Encontrar o Device no banco
            const device = await Device.findOne({ deviceId: device_id });
            if (!device) {
                console.log(`ℹ️ Device ignorado (não registrado): ${device_id}`);
                return;
            }

            // Calcular potência (W)
            const power_w = tensao_v * (corrente_ma / 1000);

            // Criar leitura
            const reading = await Reading.create({
                device: device._id,
                deviceId: device_id,
                tensao_v,
                corrente_ma,
                luminosidade_lux,
                power_w,
                received_at: new Date()
            });

            console.log(`💾 Leitura salva para ${device_id}: ${power_w.toFixed(2)}W`);

            // Processar alertas
            await alertService.processReadingForAlerts(reading, device);

        } catch (error) {
            console.error("❌ Erro ao processar mensagem MQTT:", error);
        }
    });

    mqttClient.on('error', (err) => {
        console.error("❌ Erro MQTT:", err);
    });

    return mqttClient;
};

module.exports = { connectMQTT };
