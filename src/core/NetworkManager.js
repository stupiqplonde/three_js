import {io} from 'socket.io-client';

export class NetworkManager{
    constructor(){
        this.socket = null;
        this.sessionId = null;
        this.playerName = null;
        this.selectModel = null;

        this.onInit = null;
        this.onPlayerJoined = null;
        this.onPlayerMoved = null;
        this.onPlayerLeft = null;

        this.position = null;
        this.rotation = null;
    }

    connect(sessionId, playerName, modelShip){
        this.sessionId = sessionId;
        this.playerName = playerName;
        this.selectModel = modelShip;
        this.socket = io();

        this.socket.on('connect', () => {
            this.socket.emit('join', this.sessionId, this.playerName, this.selectModel);
        });

        this.socket.on('init', (players) => {
            if (this.onInit) this.onInit(players);
        });

        this.socket.on('playerJoined', (player) => {
            if (this.onPlayerJoin) this.onPlayerJoin(player);
        });
        
        this.socket.on('playerMoved', (data) => {
            if (this.onPlayerMove) this.onPlayerMove(data);
        });

        this.socket.on('playerLeft', (id) => {
            if (this.onPlayerLeave) this.onPlayerLeave(id);
        });
        
        setInterval(() => {
            if (this.position && this.socket.connected) {
                this.socket.emit('move', this.position, this.rotation);
            }
        }, 50);
    }

    sendPosition(position, rotation){
        this.position = { x: position.x, y: position.y, z: position.z };
        this.rotation = { x: rotation.x, y: rotation.y, z: rotation.z };
    }
}