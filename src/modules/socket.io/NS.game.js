const fs = require('fs');
const filePath = 'src/json/futsu_ga_ichiban.json';
const players = {};
let ready = 0;
let cc = 0;

module.exports = function (game) {
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
};