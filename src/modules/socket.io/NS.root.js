const crypto = require('crypto');
const { setTimeout } = require('timers/promises');
const rooms = {};
const isRoomUserReady = {};

module.exports = function (root) {
    root.on('connection', (socket) => {
        socket.on('privateCreateRoom', () => {
            let rdmChr = generateRandomString(8);
            socket.join(rdmChr);
            console.log(socket.id);
            console.log(typeof socket.id);

            if (!isRoomUserReady[rdmChr]) {
                isRoomUserReady[rdmChr] = {}; // 新しいオブジェクトを作成して初期化する
            }
            isRoomUserReady[rdmChr][socket.id] = { id: socket.id, ready: false };
            socket.emit('roomIDforSession', { data: rdmChr, isEnter: true });
            searchClients(root, rdmChr);
        });
        socket.on('privateSearchRoom', (data) => {
            if (root.adapter.rooms.has(data)) {
                let clients = clientsNum(root, data);
                if (clients < 4) {
                    socket.join(data);
                    console.log(socket.id);
                    console.log(typeof socket.id);

                    isRoomUserReady[data][socket.id] = { id: socket.id, ready: false };
                    socket.emit('roomIDforSession', { data: data, isEnter: true });
                    searchClients(root, data);
                    root.to(data).emit('sendBtn');
                } else {
                    console.log('ルームは満員です。');
                }
            } else {
                console.log('ルームが存在しません。');
            }
        });
        socket.on('setupReady', (data) => {
            isRoomUserReady[data][socket.id].ready = true;
            if (isRoomUserReadyCheck(isRoomUserReady[data])) {
                console.log('全員準備完了');
                root.to(data).emit('sendSetupPage');
            }
        });



        socket.on('leaveRoom', (data) => {
            socket.leave(data);
            searchClients(root, data);
        });
        socket.on('disconnecting', () => {
            const roomNames = Array.from(socket.rooms).filter(roomId => roomId !== socket.id);
            roomNames.forEach((roomName) => {
                socket.leave(roomName);
                searchClients(root, roomName);
            });
        });
        //----------
        socket.on('join', (data) => {//ランダムマッチ入室イベント受信
            socket.join("waitingRoom");//待機所に入室

            if (!rooms["waitingRoom"]) {//もし誰も待機所にいなかったら
                rooms["waitingRoom"] = [];//プレイヤーのIDと名前が格納されたオブジェクトを入れる配列を作成
            }

            let publicUser = {//プレイヤー情報格納
                id: socket.id,//一意のID
                name: data//formで入力されたプレイヤー名
            };

            //既にプレイヤー情報が格納されていたらtrue
            const duplicate = rooms["waitingRoom"].some(obj => obj.id === publicUser.id);

            if (!duplicate) {//格納されていなかったらプッシュ
                rooms["waitingRoom"].push(publicUser);
            }

            //ルームのプレイヤー全員に現在のプレイヤー情報を送信
            root.to('waitingRoom').emit('data', rooms["waitingRoom"]);

            searchClients(root, "waitingRoom");
        });

        socket.on('disconnecting', () => {
            if (rooms["waitingRoom"]) {//もしルームが作成されていたら
                console.log(rooms["waitingRoom"], 1);

                rooms["waitingRoom"].find((el) => {//接続が切れたプレイヤーのIDをもとに削除
                    if (el.id == socket.id) {
                        console.log(rooms["waitingRoom"], 2);
                        rooms["waitingRoom"] = rooms["waitingRoom"].filter(obj => obj.id !== socket.id);
                        console.log(rooms["waitingRoom"], 3);
                    } else {
                        console.log('抜けてないよ');
                    };
                });
            } else {
                //console.log('waitingRoomが存在してないよ');
            }
        });
    });
};

const searchClients = (nameSpace, roomName) => {
    let room = nameSpace.adapter.rooms.get(roomName);
    let roomClients = room ? room.size : 0;
    nameSpace.to(roomName).emit('clientList', roomClients);
};

const clientsNum = (nameSpace, roomName) => {
    let room = nameSpace.adapter.rooms.get(roomName);
    let roomClients = room ? room.size : 0;
    return roomClients;
};

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const isRoomUserReadyCheck = (users) => {
    for (const user in users) {
        if (!users[user].ready) {
            return false;
        } else {
            return true;
        }
    }
};