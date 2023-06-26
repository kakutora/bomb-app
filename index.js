const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const ejs = require('ejs');
const rootNamespace = require('./src/modules/socket.io/NS.root');
const gameNamespace = require('./src/modules/socket.io/NS.game');
const root = io.of("/");
const game = io.of("/game");

app.set('view engine', 'ejs');

app.use("/js", express.static(__dirname + "/dist/js/"));
app.use("/css", express.static(__dirname + "/dist/css/"));
app.use("/img", express.static(__dirname + "/dist/img/"));
app.use("/fonts", express.static(__dirname + "/dist/fonts/"));

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index');
});

app.get('/game', (req, res) => {
    res.render(__dirname + '/views/game/index');
});

rootNamespace(root);
gameNamespace(game);

server.listen(3000, () => {
    console.log("Server started on port 3000");
});
