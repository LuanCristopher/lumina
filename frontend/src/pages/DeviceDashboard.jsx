import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Zap, ThermometerSun, Activity, Sun } from 'lucide-react';

const DeviceDashboard = () => {
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [deviceRes, readingsRes] = await Promise.all([
                api.get(`/devices`), // Need to find the specific device from the list as there's no GET /devices/:id
                api.get(`/devices/${id}/readings?limit=50`)
            ]);

            const foundDevice = deviceRes.data.find(d => d._id === id);
            setDevice(foundDevice);
            setReadings(readingsRes.data.reverse()); // Reverse to show chronologically in chart
        } catch (err) {
            console.error('Erro ao buscar dados do device', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [id]);

    if (loading) return <Layout><p>Carregando...</p></Layout>;
    if (!device) return <Layout><p>Device não encontrado.</p></Layout>;

    const lastReading = readings[readings.length - 1] || {};

    const chartData = readings.map(r => ({
        time: new Date(r.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        potencia: r.power_w,
        luminosidade: r.luminosidade_lux / 1000 // scale down for visual comparison
    }));

    return (
        <Layout>
            <div className="mb-6 flex items-center">
                <Link to="/devices" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{device.name}</h1>
                    <p className="text-sm text-gray-500">ID: {device.deviceId}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Potência</p>
                            <h3 className="text-2xl font-bold">{(lastReading.power_w || 0).toFixed(3)} W</h3>
                        </div>
                        <Zap className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tensão</p>
                            <h3 className="text-2xl font-bold">{(lastReading.tensao_v || 0).toFixed(2)} V</h3>
                        </div>
                        <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Corrente</p>
                            <h3 className="text-2xl font-bold">{(lastReading.corrente_ma || 0).toFixed(1)} mA</h3>
                        </div>
                        <Activity className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Luminosidade</p>
                            <h3 className="text-2xl font-bold">{(lastReading.luminosidade_lux || 0).toFixed(0)} lx</h3>
                        </div>
                        <Sun className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h3 className="text-lg font-semibold mb-6">Histórico de Potência e Luminosidade (x1000)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="potencia"
                                stroke="#eab308"
                                strokeWidth={3}
                                dot={false}
                                name="Potência (W)"
                            />
                            <Line
                                type="monotone"
                                dataKey="luminosidade"
                                stroke="#f97316"
                                strokeWidth={1}
                                strokeDasharray="5 5"
                                dot={false}
                                name="Lum. / 1000"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
};

export default DeviceDashboard;
