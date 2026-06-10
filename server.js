import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import {Server} from 'socket.io';
import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({logger: true});
const port = 8000;

fastify.register(fastifyStatic, {root: __dirname})
fastify.get('/', (_, reply) => {
    reply.sendFile('index.html');
});

fastify.listen({port: port, host: '0.0.0.0'}, () => {
    console.log(`server set http://localhost:${port}`)
})

// player data
class PlaeyrData{
    constructor(playerId, playerName, currentModel){
        this.id = playerId;
        this.name = playerName;
        this.currentModel = currentModel; // [index]
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
    }
}

// socket io sever
const io = new Server(fastify.server);
const sessions = new Map(); // {key : number, value: Map()}

io.on('connection', (socket) => {
    // join session
    socket.on('join', (sessionId, playerName) => {
        if(sessions.has(sessionId)){
            // connect
        } 
        const playerData = new PlaeyrData(socket.id, playerName);
        const session = new Map(sessionId, playerData);
        sessions.set(session.id, session);

        socket.broadcast.emit('playerJoined', playerData);
    });
    socket.on('move', (playerPosition, playerRotation) => {
        socket.broadcast.emit('playerMoved', {
            id: socket.id,
            position: playerPosition,
            rotation: playerRotation
        });
    });
    
    socket.on('disconnect', (playerId) => {

    });
})
