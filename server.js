const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// RUTA DIRECTA Y OBLIGATORIA PARA EL JSON
app.get('/preguntas.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'preguntas.json'));
});

// 2. Crear el servidor HTTP de Express
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor de Trivia Live iniciado en http://localhost:${PORT}`);
    console.log('Esperando conexiones...');
});

// 3. Pegar el servidor de WebSockets sobre el mismo puerto HTTP
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