require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { connectMQTT } = require('./services/mqttService');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB Atlas!');

        // Start MQTT Service
        connectMQTT();

        // Start Server
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Erro de conexão com o MongoDB:', err);
        process.exit(1);
    });
