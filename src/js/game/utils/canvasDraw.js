const realPaint = (rObj, vObj, players) => {
    const { vScreen, rWidth, rHeight, rCtx } = rObj;

    vtrPaint(vObj, players);

    rCtx.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);
};

const vtrPaint = (vObj, players) => {
    const { map, vCtx, mapImg } = vObj;
    paintField(map, vCtx, mapImg);

    for (const id in players) {
        const player = players[id];
        const num = players.length;
        vCtx.drawImage(vObj.chrImg[player.pNum - 1], player.x, player.y);
    }
};

const paintField = (map, vCtx, mapImg) => {//マップタイル描画処理
    for (let dy = 0; dy < map.map.length; dy++) {
        for (let dx = 0; dx < map.map[dy].length; dx++) {
            vCtx.drawImage(
                mapImg,
                map.TILESIZE * (map.map[dy][dx] % map.TILECOLUMN),
                map.TILESIZE * Math.floor(map.map[dy][dx] / map.TILECOLUMN),
                map.TILESIZE,
                map.TILESIZE,
                map.TILESIZE * dx,
                map.TILESIZE * dy,
                map.TILESIZE,
                map.TILESIZE
            );
        }
    }
};

export {
    realPaint
};

/*
const paintField = (ctx, map) => {//マップタイル描画処理
    for (let dy = 0; dy < map.map.length; dy++) {
        for (let dx = 0; dx < map.map[dy].length; dx++) {
            paintMapTile(ctx, mapImg, map.TILESIZE, map.TILECOLUMN, dy, dx, map.map[dy][dx]);
        }
    }
};

const paintMapTile = (ctx, map, ts, tc, dy, dx, idx) => {//マップタイル描画処理
    ctx.drawImage(
        map,
        ts * (idx % tc), ts * Math.floor(idx / tc), ts, ts,
        ts * dx, ts * dy, ts, ts
    );
};
*/