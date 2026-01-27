import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Plus, Cpu } from 'lucide-react';

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDeviceId, setNewDeviceId] = useState('');
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    const fetchDevices = async () => {
        try {
            const response = await api.get('/devices');
            setDevices(response.data);
        } catch (err) {
            console.error('Erro ao buscar devices', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleAddDevice = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/devices', { deviceId: newDeviceId, name: newName });
            setIsModalOpen(false);
            setNewDeviceId('');
            setNewName('');
            fetchDevices();
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao adicionar device');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Minhas Placas</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Adicionar Placa
                </button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : devices.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg shadow">
                    <Cpu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Nenhuma placa registrada.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.map((device) => (
                        <Link
                            key={device._id}
                            to={`/devices/${device._id}`}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-200"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-yellow-100 p-2 rounded-full">
                                    <Cpu className="h-6 w-6 text-yellow-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500">ID: {device.deviceId}</p>
                            <p className="text-sm text-gray-400 mt-2">Registrado em: {new Date(device.createdAt).toLocaleDateString()}</p>
                        </Link>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Adicionar Nova Placa</h2>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleAddDevice} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Device ID (Ex: lumina_esp32_01)</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    value={newDeviceId}
                                    onChange={(e) => setNewDeviceId(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome Amigável (Opcional)</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Devices;
