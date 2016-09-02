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
const GameLearn = require('../../../learn');


const _ = require('underscore');
var playerAI = null;
var ai = null;
var stupidCount = 0;
var numberOfCommands = 0;
var lastDeathCount = 0;
var started = null;
var totalCommands = 0;
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

        var playerSocket = io.connect('http://localhost:3000');
        playerSocket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);

        var self = this;
        playerSocket.on(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, (playerName, playerColor) => {
            playerAI = self.playerContainer.getPlayer('/#' + playerSocket.id);
        });
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

        if (playerAI) {
            var board = this.boardOccupancyService.board.map((coordinateRow) => {
                return coordinateRow.map((coordinateAttribute) => {
                    var index = 0;
                    var binary = "";
                    for (var attr in coordinateAttribute) {
                        if (attr == '_playerIdsWithHead')
                            binary += coordinateAttribute[attr].length > 0 ? "1" : "0";
                        else
                            binary += coordinateAttribute[attr] ? "1" : "0";
                    }
                    return parseInt(binary, 2);
                })
            });
            require('console.table');

            var playerPosition = playerAI._segments[0];
            var foodList = this.foodService.getFood();
            var foodArray = [];
            for (var foodName in foodList) {
                var food = foodList[foodName];
                var xDistance = playerPosition.x - food.coordinate.x;
                var yDistance = playerPosition.y - food.coordinate.y;

                foodArray.push({
                    distance: Math.abs(playerPosition.x - food.coordinate.x) + Math.abs(playerPosition.y - food.coordinate.y),
                    //x: playerPosition.x - food.coordinate.x,
                    //y: playerPosition.y - food.coordinate.y
                    needLeft: xDistance > 0,
                    needRight: xDistance < 0,
                    needUp: yDistance > 0,
                    needDown: yDistance < 0
                    //x: food.coordinate.x,

                    //y: food.coordinate.y
                });
            }

            foodArray = _.sortBy(foodArray, 'distance').slice(0, 10);
            var direction = '';
            var directionName = ['esquerda', 'direita', 'cima', 'baixo'];

            function getDirectionIndex(coords) {
                if (coords.x == -1)
                    return 0;
                else if (coords.x == 1)
                    return 1;
                else if (coords.y == -1)
                    return 2;
                else if (coords.y == 1)
                    return 3;
            };
            var direction = getDirectionIndex(playerAI.directionBeforeMove);
            var blocked = {
                left: this.boardOccupancyService.board[playerPosition.x - 1][playerPosition.y].wall,
                right: this.boardOccupancyService.board[playerPosition.x + 1][playerPosition.y].wall,
                up: this.boardOccupancyService.board[playerPosition.x][playerPosition.y - 1].wall,
                down: this.boardOccupancyService.board[playerPosition.x][playerPosition.y + 1].wall
            };

            if (!blocked.left)
                blocked.left = !!_.findWhere(playerAI._segments, {x: playerPosition.x - 1, y: playerPosition.y});
            if (!blocked.right)
                blocked.right = !!_.findWhere(playerAI._segments, {x: playerPosition.x + 1, y: playerPosition.y});
            if (!blocked.up)
                blocked.up = !!_.findWhere(playerAI._segments, {x: playerPosition.x, y: playerPosition.y - 1});
            if (!blocked.down)
                blocked.down = !!_.findWhere(playerAI._segments, {x: playerPosition.x, y: playerPosition.y + 1});

            var totalBlocks = 0;
            for (var blockDireciton in blocked)
                if (blocked[blockDireciton]) totalBlocks += 1;
            var playerDied = false;
            if (lastDeathCount < playerAI.deaths) {
                playerDied = true;
                lastDeathCount = playerAI.deaths;
            }

            var relativeSegments = playerAI._segments.map((coordinate) => {
                return {
                    x: playerPosition.x - coordinate.x,
                    y: playerPosition.y - coordinate.y
                }
            });

            var visionGrid = [];
            var gridRadius = 2;
            var visionGridCount = 0;
            for (var y = playerPosition.y - gridRadius; y <= playerPosition.y + gridRadius; y++) {
                visionGrid[y] = [];
                for (var x = playerPosition.x - gridRadius; x <= playerPosition.x + gridRadius; x++) {
                    if(y > 0 & x > 0){
                        visionGrid[y][x] = _.where(playerAI._segments, {x: x, y: y}).length > 0 ? 1 : 0;
                        if(visionGrid[y][x] == 0 && board[x] && board[x][y])
                            visionGrid[y][x] = board[x][y] == 24 ? 1 : 0;
                    }
                    else
                        visionGrid[y][x] = 0;
                    if(visionGrid[y][x] == 1) visionGridCount += 1;
                }
            }
            //console.table(board);
            //console.log([board[playerPosition.x + 1][playerPosition.y]]);
            //console.table(visionGrid);
            var closestFoodNonBlocked = {
                distance: 0,
                needRight: false,
                needLeft: false,
                needDown: false,
                needUp: false
            };
            for(var foodIndex = 0; foodIndex < foodArray.length; foodIndex ++){
                var currentFood = foodArray[foodIndex];
                if(currentFood.needLeft && blocked.left)
                    continue;
                if(currentFood.needRight && blocked.right)
                    continue;
                if(currentFood.needDown && blocked.down)
                    continue;
                if(currentFood.needUp && blocked.up)
                    continue;
                closestFoodNonBlocked = currentFood;
                closestFoodNonBlocked.index = foodIndex;
                break;
            }


            var metrics = {
                size: playerAI.growAmount + playerAI._segments.length,
                //moveCounter: playerAI.moveCounter,
                deathCount: playerDied,
                direction: direction,
                //directionBeforeMove: playerAI.directionBeforeMove,
                //segments: playerAI._segments,
                //relativeSegments: relativeSegments,
                //position: playerPosition,
                blocked: blocked,
                blockCount: totalBlocks,
                //closestFoodDistance: foodArray[0].distance,
                closestFoodDistance: parseInt(_.first(foodArray).distance / 1),
                closestFood: {
                    needLeft: _.first(foodArray).needLeft,
                    needRight: _.first(foodArray).needRight,
                    needUp: _.first(foodArray).needUp,
                    needDown: _.first(foodArray).needDown,
                    /*dneedLeft: !_.first(foodArray).needLeft,
                    dneedRight: !_.first(foodArray).needRight,
                    dneedUp: !_.first(foodArray).needUp,
                    dneedDown: !_.first(foodArray).needDown*/
                },
                visionGrid: visionGrid,
                //visionGridCount: visionGridCount
                //board: board
                //stupidCount: stupidCount
            };
            var validMoves = GameControlsService.getValidNextMove(playerAI.directionBeforeMove);
            if (!ai) started = new Date();
            if (!ai) ai = new GameLearn({
                file: 'snakeNetwork4.json',
                metrics: metrics,
                commands: {
                    moveUp: () => {
                        if (_.findWhere(GameControlsService.getValidNextMove(playerAI.directionBeforeMove), Direction.UP) == null) return stupidCount += 1;
                        //console.log("Goin up...");
                        playerAI.changeDirection(Direction.UP);
                    },
                    moveDown: () => {
                        if (_.findWhere(GameControlsService.getValidNextMove(playerAI.directionBeforeMove), Direction.DOWN) == null) return stupidCount += 1;
                        //console.log("Goin down...");
                        playerAI.changeDirection(Direction.DOWN);
                    },
                    moveLeft: () => {
                        if (_.findWhere(GameControlsService.getValidNextMove(playerAI.directionBeforeMove), Direction.LEFT) == null) return stupidCount += 1;
                        //console.log("Goin to the left...");
                        playerAI.changeDirection(Direction.LEFT);
                    },
                    moveRight: () => {
                        if (_.findWhere(GameControlsService.getValidNextMove(playerAI.directionBeforeMove), Direction.RIGHT) == null) return stupidCount += 1;
                        //console.log("Goin to the right...");
                        playerAI.changeDirection(Direction.RIGHT);
                    },
                    wait: () => {
                        //console.log("Waiting...");
                    }
                },
                score: {
                    size: {
                     diff: 1,
                     score: 2,
                    },
                    /*moveCounter: {
                     diff: 1,
                     score: 1
                     },*/
                    deathCount: {
                        equals: true,
                        score: -5,
                        last: true
                    },
                    blockCount: {
                        equals: 4,
                        score: -2,
                        last: true
                    },
                    /*blockCount: {
                        diff: -1,
                        score: 2,
                        disableBiggerDifference: true
                    },*/
                    /*closestFoodDistance: {
                        diff: -1,
                        score: 1,
                        //disableBiggerDifference: true
                    },*/
                    /*stupidCount: {
                     diff: -1,
                     score: 1
                     }*/
                }
            });

            var nextCommand = ai.getCommand(metrics);
            nextCommand();
            totalCommands += 1;
            //console.log("deaths / command ratio : %s" + (playerAI.deaths / totalCommands).toFixed(10));
            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);  // move cursor to beginning of line
            process.stdout.write("deaths / command ratio : " + (playerAI.deaths / totalCommands).toFixed(10));
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

        setTimeout(this.runGameCycle.bind(this), 1);
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
        GameControlsService.handleKeyDown(this.playerContainer.getPlayer(playerId), keyCode);
    }
}

module.exports = GameController;
