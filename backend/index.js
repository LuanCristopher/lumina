require('dotenv').config();
const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGO_URI);

async function run() {
    try {
        // Conectar ao MongoDB
        await mongoClient.connect();
        const database = mongoClient.db("lumina_db");
        const collection = database.collection("solar_readings"); 
        console.log("✅ Conectado ao MongoDB Atlas!");

        // Conectar ao HiveMQ
        const mqttClient = mqtt.connect(process.env.MQTT_HOST, {
            username: process.env.MQTT_USER,
            password: process.env.MQTT_PASS,
            port: process.env.MQTT_PORT,
            protocol: 'mqtts',
        });

        mqttClient.on('connect', () => {
            console.log("✅ Conectado ao HiveMQ!");
            mqttClient.subscribe(process.env.MQTT_TOPIC, (err) => {
                if (!err) console.log(`📡 Ouvindo tópico: ${process.env.MQTT_TOPIC}`);
            });
        });

        // Processar Mensagens Recebidas
        mqttClient.on('message', async (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                
                console.log(`📥 Recebido de [${payload.device_id}]:`, payload);

                const doc = {
                    ...payload,
                    received_at: new Date(),
                };

                const result = await collection.insertOne(doc);
                console.log(`💾 Salvo no MongoDB com ID: ${result.insertedId}`);

            } catch (e) {
                console.error("❌ Erro ao processar mensagem JSON:", e);
            }
        });

    } catch (error) {
        console.error("Erro fatal:", error);
    }
}

run();