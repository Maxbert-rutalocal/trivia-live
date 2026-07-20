const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Esto permite que el servidor web muestre tus archivos HTML al público
app.use(express.static(path.join(__dirname)));

// Iniciamos el servidor Web
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor Web y WebSocket iniciados en el puerto ${PORT}.`);
});

// Iniciamos el servidor de WebSockets pegado al servidor Web
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