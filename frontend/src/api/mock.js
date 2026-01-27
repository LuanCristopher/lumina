const mockData = {
    '/auth/login': {
        _id: 'mock_user_1',
        email: 'demo@lumina.com',
        token: 'mock_jwt_token'
    },
    '/auth/register': {
        _id: 'mock_user_1',
        email: 'demo@lumina.com',
        token: 'mock_jwt_token'
    },
    '/devices': [
        { _id: '1', deviceId: 'lumina_esp32_01', name: 'Placa Principal Telhado', createdAt: new Date() },
        { _id: '2', deviceId: 'lumina_esp32_02', name: 'Placa Garagem', createdAt: new Date() }
    ],
    '/alerts?status=open': [
        {
            _id: 'a1',
            deviceId: 'lumina_esp32_01',
            type: 'NEEDS_CLEANING',
            message: 'Luminosidade alta (12500 lux) mas potência baixa (0.15 W). A placa pode estar suja.',
            status: 'open',
            createdAt: new Date()
        }
    ],
    '/alerts?status=resolved': [],
    '/alerts?status=all': [
        {
            _id: 'a1',
            deviceId: 'lumina_esp32_01',
            type: 'NEEDS_CLEANING',
            message: 'Luminosidade alta (12500 lux) mas potência baixa (0.15 W). A placa pode estar suja.',
            status: 'open',
            createdAt: new Date()
        }
    ]
};

// Mock for readings
const getMockReadings = () => {
    const readings = [];
    const now = new Date();
    for (let i = 0; i < 50; i++) {
        readings.push({
            _id: `r${i}`,
            deviceId: 'lumina_esp32_01',
            tensao_v: 5.5 + Math.random(),
            corrente_ma: 100 + Math.random() * 100,
            luminosidade_lux: 8000 + Math.random() * 4000,
            power_w: 0.5 + Math.random() * 0.5,
            received_at: new Date(now.getTime() - (50 - i) * 10000)
        });
    }
    return readings;
};

export const handleMockRequest = async (config) => {
    const url = config.url;
    console.log(`[Mock API] Request to: ${url}`);

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

    if (url.includes('/readings')) {
        return { data: getMockReadings() };
    }

    if (mockData[url]) {
        return { data: mockData[url] };
    }

    // Default response for POST/PATCH success
    return { data: { success: true } };
};
