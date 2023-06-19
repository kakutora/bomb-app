const express = require("express");
const ejs = require('ejs');
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const fs = require('fs');
const filePath = 'src/json/futsu_ga_ichiban.json';
const { exec } = require('child_process');
const webpackProcess = exec('webpack --watch');
/*
const chokidar = require('chokidar');
const watcher = chokidar.watch('views');
*/

app.set('view engine', 'ejs');

app.use("/js", express.static(__dirname + "/dist/js/"));
app.use("/css", express.static(__dirname + "/dist/css/"));
app.use("/img", express.static(__dirname + "/src/img/"));

app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/views/');
    const data = {
        val: "tesutiobunsjifj"
    };
    res.render(__dirname + '/views/index', data);
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/views/game/');
});

/*
const init = io.of("/head");

init.on('connection', (socket) => {
    webpackProcess.stdout.on('data', (data) => {
        const output = data.toString();

        if (output.includes('webpack 5.87.0 compiled with')) {
            console.log('バンドル完了通知');
            socket.emit('reload');
        }
    });

    watcher.on('change', (path) => {
        console.log('EJS file changed:', path);
        socket.emit('reload');
    });
});
*/

const root = io.of("/");
const rooms = {};

root.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join("waitingRoom");

        if (!rooms["waitingRoom"]) {
            rooms["waitingRoom"] = [];
        }

        let userObj = {
            id: socket.id,
            name: data
        };

        const duplicate = rooms["waitingRoom"].some(obj => obj.id === userObj.id);

        if (!duplicate) {
            rooms["waitingRoom"].push(userObj);
        }

        root.to('waitingRoom').emit('data', rooms["waitingRoom"]);

        searchClients("waitingRoom");
    });

    socket.on('disconnecting', () => {
        if (rooms["waitingRoom"]) {
            console.log(rooms["waitingRoom"], 1);

            rooms["waitingRoom"].find((el) => {
                if (el.id == socket.id) {
                    console.log(rooms["waitingRoom"], 2);
                    rooms["waitingRoom"] = rooms["waitingRoom"].filter(obj => obj.id !== socket.id);
                    console.log(rooms["waitingRoom"], 3);
                } else {
                    console.log('抜けてないよ');
                };
            });
        } else {
            console.log('waitingRoomが存在してないよ');
        }
    });
});

const searchClients = (roomName) => {
    let room = io.sockets.adapter.rooms.get(roomName);
    let roomClients = room ? room.size : 0;
    root.to(roomName).emit('clientList', roomClients);
};



















const game = io.of("/game");
const players = {};
let ready = 0;
let cc = 0;

game.on("connection", (socket) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('ファイルの読み込みエラー:', err);
            return;
        } else {
            const jsonData = JSON.parse(data);
            console.log('page2');

            const playerID = socket.id;
            cc++;

            players[playerID] = {
                x: jsonData.firstPlayerPos[cc - 1].x,
                y: jsonData.firstPlayerPos[cc - 1].y,
                pNum: cc
            };

            socket.emit("assignPlayerIdPos", { pid: playerID, y: players[playerID].y, x: players[playerID].x, pNum: players[playerID].pNum });
            game.emit('pos', players);

            socket.on("ready", () => {
                ready++;
                if (ready == 2) {
                    game.emit("startGame", jsonData);
                    ready = 0;
                }
            });

            socket.on("playerMove", (data) => {
                players[playerID] = data;
                game.emit("playerUpdate", players);
            });

            socket.on("disconnecting", () => {
                delete players[playerID];
                game.emit("playerUpdate", players);
                game.emit('reload');
                cc = 0;
            });
        }
    });
});

server.listen(3000, () => {
    console.log("Server started on port 3000");
});

const { v4: uuidv4 } = require('uuid');
const { SocketAddress } = require("net");

// 使用例:
const uuid = uuidv4(); // ランダムなUUIDを生成
console.log(uuid);