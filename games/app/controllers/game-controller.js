'use strict';

const ServerConfig = require('../configs/server-config');

const AdminService = require('../services/admin-service');
const BoardOccupancyService = require('../services/board-occupancy-service');
const BotDirectionService = require('../services/bot-direction-service');
const FoodService = require('../services/food-service');
const GameControlsService = require('../services/game-controls-service');
const ImageService = require('../services/image-service');
const NameService = require('../services/name-service');
const NotificationService = require('../services/notification-service');
const PlayerService = require('../services/player-service');

const Coordinate = require('../models/coordinate');
const PlayerContainer = require('../models/player-container');
const PlayerStatBoard = require('../models/player-stat-board');
const Direction = require('../models/direction');
const Player = require('../models/player');
const io = require('socket.io-client');

//4
const GameLearn = require('../../../../learn');


const _ = require('underscore');
var playerAI = null;
var ai = null;
class GameController {

    constructor() {
        // Model Containers
        this.playerContainer = new PlayerContainer();
        this.playerStatBoard = new PlayerStatBoard();

        // Services
        this.nameService = new NameService();
        this.boardOccupancyService = new BoardOccupancyService();
        this.notificationService = new NotificationService();
        this.botDirectionService = new BotDirectionService(this.boardOccupancyService);
        this.foodService = new FoodService(this.playerStatBoard, this.boardOccupancyService,
            this.nameService, this.notificationService);
        this.imageService = new ImageService(this.playerContainer, this.playerStatBoard, this.notificationService);
        this.playerService = new PlayerService(this.playerContainer, this.playerStatBoard, this.boardOccupancyService,
            this.imageService, this.nameService, this.notificationService, this.runGameCycle.bind(this));
        this.adminService = new AdminService(this.playerContainer, this.foodService, this.nameService,
            this.notificationService, this.playerService);
        this.playerService.init(this.adminService.getPlayerStartLength.bind(this.adminService));
        
        //const playerId = this.nameService.getBotId();
        //console.log(playerId)
        // Add new player
        //const playerSocket = {};
        //playerSocket.emit = () => console.log(arguments);
        //var player = new Player();
        //player.changeDirection(Direction.RIGHT);

       // playerSpawnService = new PlayerSpawnService(boardOccupancyService);
        //this.boardOccupancyService.addPlayerOccupancy('AI', [new Coordinate(11, 10)]);
        //playerSpawnService.setupNewSpawn(player, playerLength, requiredFreeLength);
        var playerSocket = io.connect('http://localhost:3000');
        playerSocket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);

        var self = this;
        playerSocket.on(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, (playerName, playerColor) => {
            console.log(playerSocket.id);
            playerAI = self.playerContainer.getPlayer('/#' + playerSocket.id);
        });

        playerSocket.on(ServerConfig.IO.OUTGOING.NOTIFICATION, () => {
            console.log(arguments);
        });
        //console.log(playerSocket);
        //var player = this.playerService.addPlayer(playerSocket, 'AI');

        //var bot = new Player();
        //bot._segments = [new Coordinate(10, 10)];
        //bot.changeDirection(Direction.RIGHT);
        //this.boardOccupancyService = new BoardOccupancyService();

    }

    // Listen for Socket IO events
    listen(io) {
        this.notificationService.setSockets(io.sockets);
        const self = this;
        io.sockets.on(ServerConfig.IO.DEFAULT_CONNECTION, socket => {
            socket.on(ServerConfig.IO.INCOMING.CANVAS_CLICKED, self._canvasClicked.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.KEY_DOWN, self._keyDown.bind(self, socket.id));

            // Player Service
            socket.on(ServerConfig.IO.INCOMING.NEW_PLAYER,
                self.playerService.addPlayer.bind(self.playerService, socket));
            socket.on(ServerConfig.IO.INCOMING.NAME_CHANGE,
                self.playerService.changePlayerName.bind(self.playerService, socket));
            socket.on(ServerConfig.IO.INCOMING.COLOR_CHANGE,
                self.playerService.changeColor.bind(self.playerService, socket));
            socket.on(ServerConfig.IO.INCOMING.JOIN_GAME,
                self.playerService.playerJoinGame.bind(self.playerService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.SPECTATE_GAME,
                self.playerService.playerSpectateGame.bind(self.playerService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.DISCONNECT,
                self.playerService.disconnectPlayer.bind(self.playerService, socket.id));
            // Image Service
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_BACKGROUND_IMAGE,
                self.imageService.clearBackgroundImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.BACKGROUND_IMAGE_UPLOAD,
                self.imageService.updateBackgroundImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_IMAGE,
                self.imageService.clearPlayerImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.IMAGE_UPLOAD,
                self.imageService.updatePlayerImage.bind(self.imageService, socket.id));
            // Admin Service
            socket.on(ServerConfig.IO.INCOMING.BOT_CHANGE,
                self.adminService.changeBots.bind(self.adminService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.FOOD_CHANGE,
                self.adminService.changeFood.bind(self.adminService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.SPEED_CHANGE,
                self.adminService.changeSpeed.bind(self.adminService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.START_LENGTH_CHANGE,
                self.adminService.changeStartLength.bind(self.adminService, socket.id));
        });
    }

    runGameCycle() {
        // Pause and reset the game if there aren't any players
        if (this.playerContainer.getNumberOfPlayers() - this.adminService.getBotIds().length === 0) {
            console.log('Game Paused');
            this.boardOccupancyService.initializeBoard();
            this.adminService.resetGame();
            this.nameService.reinitialize();
            this.imageService.resetBackgroundImage();
            this.foodService.reinitialize();
            this.playerContainer.reinitialize();
            this.playerStatBoard.reinitialize();
            return;
        }

        // Change bots' directions
        for (const botId of this.adminService.getBotIds()) {
            const bot = this.playerContainer.getPlayer(botId);
            if (Math.random() <= ServerConfig.BOT_CHANGE_DIRECTION_PERCENT) {
                this.botDirectionService.changeToRandomDirection(bot);
            }
            this.botDirectionService.changeDirectionIfInDanger(bot);
        }
        if(playerAI){
            var board = this.boardOccupancyService.getBoard();
            var metrics = {
                size: playerAI.growAmount + playerAI._segments.length,
                direction: playerAI.direction,
                moveCounter: playerAI.moveCounter,
                directionBefore: playerAI.directionBefore,
                segments: playerAI._segments,
                board: board
            };
            if(!ai) ai = new GameLearn({
                metrics: metrics,
                commands: {
                    moveUp: () => {
                        console.log("Goin up...");
                        playerAI.changeDirection(Direction.UP);
                    },
                    moveDown: () => {
                        console.log("Goin down...");
                        playerAI.changeDirection(Direction.DOWN);
                    },
                    moveLeft: () => {
                        console.log("Goin to the left...");
                        playerAI.changeDirection(Direction.LEFT);
                    },
                    moveRight: () => {
                        console.log("Goin to the right...");
                        playerAI.changeDirection(Direction.RIGHT); 
                    },
                    wait: () => {
                        console.log("Waiting...");   
                    }
                },
                score: {
                    size: {
                        diff: 1,
                        score: 3
                    },
                    moveCounter: {
                        diff: 1,
                        score: 2
                    }
                }
            });
            console.log("Thinking...");
            var nextCommand = ai.getCommand(metrics);
            nextCommand();


            //console.log(nextCommand.toString());

            // Parse board
            //this.botDirectionService.changeDirectionIfInDanger(playerAI);
        }

        this.playerService.movePlayers();

        this.playerService.handlePlayerCollisions();
        this.playerService.respawnPlayers();

        this.foodService.consumeAndRespawnFood(this.playerContainer);

        const gameState = {
            players: this.playerContainer,
            food: this.foodService.getFood(),
            playerStats: this.playerStatBoard,
            walls: this.boardOccupancyService.getWallCoordinates(),
            speed: this.adminService.getGameSpeed(),
            numberOfBots: this.adminService.getBotIds().length,
            startLength: this.adminService.getPlayerStartLength(),
        };
        this.notificationService.broadcastGameState(gameState);

        setTimeout(this.runGameCycle.bind(this), 1000 / this.adminService.getGameSpeed());
    }

    /*******************************
     *  socket.io handling methods *
     *******************************/

    _canvasClicked(socket, x, y) {
        const player = this.playerContainer.getPlayer(socket.id);
        const coordinate = new Coordinate(x, y);
        if (this.boardOccupancyService.isPermanentWall(coordinate)) {
            return;
        }
        if (this.boardOccupancyService.isWall(coordinate)) {
            this.boardOccupancyService.removeWall(coordinate);
            this.notificationService.broadcastNotification(`${player.name} has removed a wall`, player.color);
        } else {
            this.boardOccupancyService.addWall(coordinate);
            this.notificationService.broadcastNotification(`${player.name} has added a wall`, player.color);
        }
    }

    _keyDown(playerId, keyCode) {
        console.log(playerId);
        GameControlsService.handleKeyDown(this.playerContainer.getPlayer(playerId), keyCode);
    }
}

module.exports = GameController;
