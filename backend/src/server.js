require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { connectMQTT } = require('./services/mqttService');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
console.log('⏳ Conectando ao MongoDB...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB Atlas!');
    })
    .catch((err) => {
        console.error('❌ Erro de conexão com o MongoDB:', err);
        // We will continue anyway for development/testing if needed,
        // but in production this might be critical.
    });

// Start MQTT Service
connectMQTT();

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
