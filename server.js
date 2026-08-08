const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

app.get('/preguntas.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'preguntas.json'));
});

// 2. Crear el servidor HTTP de Express
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor de Trivia Live iniciado en http://localhost:${PORT}`);
});

// 3. Servidor de WebSockets
const wss = new WebSocketServer({ server });
let clientesActivos = [];

wss.on('connection', (ws) => {
    clientesActivos.push(ws);
    
    ws.on('message', (message) => {
        try {
            const datos = JSON.parse(message);
            clientesActivos.forEach(cliente => {
                if (cliente.readyState === 1) {
                    cliente.send(JSON.stringify(datos));
                }
            });
        } catch (e) {
            console.error("Error al procesar datos:", e);
        }
    });

    ws.on('close', () => {
        clientesActivos = clientesActivos.filter(c => c !== ws);
    });
});

// ==========================================
// 4. CONEXIÓN DIRECTA A TIKTOK LIVE
// ==========================================
let tiktokUsername = "hubertmarquez0"; 
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection.connect().then(state => {
    console.info(`✅ Conectado exitosamente al Live de TikTok: ${state.roomId}`);
}).catch(err => {
    console.error('❌ Error conectando a TikTok. ¿Estás en vivo en este momento?', err);
});

// Escuchar el evento cuando alguien entra al live (Member Join)
tiktokLiveConnection.on('member', data => {
    const mensajeSaludo = JSON.stringify({ tipo: 'NUEVO_ESPECTADOR', usuario: data.uniqueId });
    
    // Enviar la señal de saludo al tablero admin.html
    clientesActivos.forEach(cliente => {
        if (cliente.readyState === 1) {
            cliente.send(mensajeSaludo);
        }
    });
});