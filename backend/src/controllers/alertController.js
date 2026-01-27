const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
    const { status } = req.query;
    let query = { userId: req.user.id };

    if (status && (status === 'open' || status === 'resolved')) {
        query.status = status;
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
};

const resolveAlert = async (req, res) => {
    const alert = await Alert.findOne({ _id: req.params.id, userId: req.user.id });

    if (!alert) {
        res.status(404);
        throw new Error('Alerta não encontrado');
    }

    alert.status = 'resolved';
    alert.resolvedAt = new Date();

    const updatedAlert = await alert.save();
    res.json(updatedAlert);
};

module.exports = {
    getAlerts,
    resolveAlert
};
