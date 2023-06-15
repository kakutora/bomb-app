/**
 * キャラクターを移動させる命令をサーバに送る関数
 * @param {Object} map マップの二次配列
 * @param {Object} player 各プレイヤーの位置情報
 * @param {Object} key キー入力を保存しておくためのオブジェクト
 */
const keyInput = (map, player, key) => {
    if (key.move === 0) {
        const { left, right, up, down } = key;
        const x = player.x / map.TILESIZE;
        const y = player.y / map.TILESIZE;

        if (left && map.moveAllow.includes(map.map[y][x - 1])) {
            key.move = map.TILESIZE;
            key.push = 'left';
        }
        if (right && map.moveAllow.includes(map.map[y][x + 1])) {
            key.move = map.TILESIZE;
            key.push = 'right';
        }
        if (up && y > 0 && map.moveAllow.includes(map.map[y - 1][x])) {
            key.move = map.TILESIZE;
            key.push = 'up';
        }
        if (down && y < map.MAP_WIDTH - 1 && map.moveAllow.includes(map.map[y + 1][x])) {
            key.move = map.TILESIZE;
            key.push = 'down';
        }
    }
};

const KeyOutput = (moveSpeed, player, key, socket) => {
    if (key.move > 0) {
        key.move -= moveSpeed;
        if (key.push === 'left') player.x -= moveSpeed;
        if (key.push === 'up') player.y -= moveSpeed;
        if (key.push === 'right') player.x += moveSpeed;
        if (key.push === 'down') player.y += moveSpeed;
        socket.emit("playerMove", player);
    }
};

const keyEvent = (e, key, isBoolean) => {
    if (e.keyCode === 37) key.left = isBoolean;
    if (e.keyCode === 38) key.up = isBoolean;
    if (e.keyCode === 39) key.right = isBoolean;
    if (e.keyCode === 40) key.down = isBoolean;
    event.preventDefault();
};

export { keyInput, KeyOutput, keyEvent };