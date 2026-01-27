const dns = require('dns');

const hostname = '_mongodb._tcp.lumina-cluster0.jn7czxy.mongodb.net';

console.log(`🔍 Consultando registros SRV para: ${hostname}...`);

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('❌ Erro na consulta SRV:', err.code);
        console.error('Isso confirma que sua rede está bloqueando consultas SRV.');
        console.error('Tente mudar o DNS do seu computador para 8.8.8.8 (Google).');
        return;
    }

    console.log('✅ Endereços reais encontrados no Cluster:');
    addresses.forEach(addr => {
        console.log(`   👉 ${addr.name}:${addr.port}`);
    });
});