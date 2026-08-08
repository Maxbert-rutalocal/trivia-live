const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
const PORT = process.env.PORT || 8080;

// RUTA ANTI-CACHÉ APUNTANDO AL NUEVO ARCHIVO
app.get('/mazo_final.json', (req, res) => {
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'mazo_final.json'));
});

app.use(express.static(path.join(__dirname)));

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor de Trivia Live iniciado en http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });
let clientesActivos = [];

wss.on('connection', (ws) => {
    clientesActivos.push(ws);
    ws.on('message', (message) => {
        try {
            const datos = JSON.parse(message);
            clientesActivos.forEach(cliente => {
                if (cliente.readyState === 1) cliente.send(JSON.stringify(datos));
            });
        } catch (e) { console.error("Error al procesar datos:", e); }
    });
    ws.on('close', () => { clientesActivos = clientesActivos.filter(c => c !== ws); });
});

// CONEXIÓN A TIKTOK LIVE
let tiktokUsername = "hubertmarquez0"; 
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection.connect().then(state => {
    console.info(`✅ Conectado exitosamente al Live de TikTok: ${state.roomId}`);
}).catch(err => {
    console.error('❌ Error conectando a TikTok. ¿Estás en vivo en este momento?', err);
});

tiktokLiveConnection.on('member', data => {
    const mensajeSaludo = JSON.stringify({ tipo: 'NUEVO_ESPECTADOR', usuario: data.uniqueId });
    clientesActivos.forEach(cliente => {
        if (cliente.readyState === 1) cliente.send(mensajeSaludo);
    });
});