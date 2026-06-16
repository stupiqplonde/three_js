import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import {Server} from 'socket.io';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {Ship} from './src/entities/Ship.js'
import {dbManager} from './src/database/DatabaseManager.js'
//___________ ищем папку в которой лежит файл сервера
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//___________ инициализируем сервер
const fastify = Fastify({logger: false});
const PORT = 8000;
//___________ регистрируем статические файлы и отдаем по основному запросу
fastify.register(fastifyStatic,{root: __dirname});
fastify.get('/', (_, reply) => {
    reply.sendFile('index.html');
});
//___________ поднимаем сервер и слушаем клиенты
fastify.listen({port: PORT, host: '0.0.0.0'}, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`Игрок 1: http://localhost:${PORT}/?session=game1&name=Player1`);
    console.log(`Игрок 2: http://localhost:${PORT}/?session=game1&name=Player2`);
});

//___________ создаем сервер для вебсокета и инициализируем сессии
const io = new Server(fastify.server);
const sessions = new Map();
//___________ ожидаем запрос от клиентов по TCP соединению и прослушиваем события
io.on('connection', (socket) => {
    socket.on('join', (sessionId, playerName, selectModel) => {
        if(!sessions.has(sessionId)){
            sessions.set(sessionId, new Map());
        }
        const session = sessions.get(sessionId);
        const player = new Player(socket.id, playerName, selectModel);

        session.set(socket.id, player);

        const otherPlayers = Array.from(session.values()).filter(player => player.id !== socket.id);
        socket.emit('init', otherPlayers);
        socket.broadcast.emit('playerJoined', player);
    });

    socket.on('move', (position, rotation) => {
        for(const [_, session] of sessions){
            if(session.has(socket.id)){
                const player = session.get(socket.id);
                if(player){
                    player.position = position,
                    player.rotation = rotation
                    socket.broadcast.emit('playerMoved', {
                        id: socket.id,
                        position,
                        rotation
                    });
                }
                break;
            }
        }
    });

    socket.on('disconnect', (sessionId) => {
        for(const [sessionId, session] of sessions){
            if(session.has(socket.id)){
                session.delete(socket.id);
                socket.broadcast.emit('playerLeft', socket.id);
                if(session.size === 0){
                    sessions.delete(sessionId);
                }
                break;
            }
        }
    });
});