import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('open'); // 'open', 'resolved', 'all'

    const fetchAlerts = async () => {
        try {
            const response = await api.get(`/alerts?status=${filter}`);
            setAlerts(response.data);
        } catch (err) {
            console.error('Erro ao buscar alertas', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, [filter]);

    const handleResolve = async (id) => {
        try {
            await api.patch(`/alerts/${id}/resolve`);
            fetchAlerts();
        } catch (err) {
            console.error('Erro ao resolver alerta', err);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
                <div className="flex bg-gray-200 rounded-md p-1">
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                            filter === 'open' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                        }`}
                    >
                        Abertos
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                            filter === 'resolved' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                        }`}
                    >
                        Resolvidos
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                            filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                        }`}
                    >
                        Todos
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : alerts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg shadow">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Nenhum alerta encontrado.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`bg-white p-6 rounded-lg shadow border-l-4 ${
                                alert.status === 'open' ? 'border-red-500' : 'border-green-500'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                    {alert.status === 'open' ? (
                                        <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                                    ) : (
                                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {alert.deviceId} - {alert.type === 'NEEDS_CLEANING' ? 'Necessita Limpeza' : alert.type}
                                        </h3>
                                        <p className="text-gray-600 mt-1">{alert.message}</p>
                                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                                            <span className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                Criado em: {new Date(alert.createdAt).toLocaleString()}
                                            </span>
                                            {alert.status === 'resolved' && (
                                                <span className="flex items-center">
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Resolvido em: {new Date(alert.resolvedAt).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {alert.status === 'open' && (
                                    <button
                                        onClick={() => handleResolve(alert._id)}
                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition text-sm font-medium"
                                    >
                                        Marcar como Resolvido
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Alerts;
