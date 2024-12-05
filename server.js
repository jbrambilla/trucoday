import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import socketInit from './sockets/trucoSocket.js';

import routerUsuarios from './Routes/usuarioRoute.js';
import routerSalas from './Routes/salasRoutes.js';
import routerBaralho from './Routes/baralhoRoutes.js';
import participanteRoutes from './Routes/participanteRoutes.js';
import equipeRoutes from './Routes/equipeRoutes.js';
import jogoRoutes from './Routes/jogoRoutes.js';
import maoRoutes from './Routes/maoRoutes.js';
import rodadaRoutes from './Routes/rodadaRoutes.js';
import cartaRoutes from './Routes/cartaRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

const socketList = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
  }
});

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use("/usuarios", routerUsuarios);
app.use("/salas", routerSalas);
app.use("/baralho", routerBaralho);
app.use('/participantes', participanteRoutes);
app.use('/equipe', equipeRoutes);
app.use('/jogo', jogoRoutes);
app.use('/mao', maoRoutes);
app.use('/rodada', rodadaRoutes);
app.use('/carta', cartaRoutes);

socketInit(socketList);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`BackEnd - Servidor web e WebSocket rodando na porta ${PORT}!`);
});

