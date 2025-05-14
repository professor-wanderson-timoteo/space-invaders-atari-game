const ShieldPiece = require('./shield_piece');
const Util = require('./util');

const Shield = function(opitions) {
    this.id = opitions.id;
    this.pos = opitions.pos;
    this.radius = opitions.radius;
    this.color = opitions.color;
    this.game = opitions.game;
};

Shield.prototype.draw = function(ctx) {
    ctx.sillStyle = this.color;
    let posX = this.pos[0];
    let posY = this.pos[1];

    for (let i = 1; i < 21; i++) {
        let shieldPiece = new ShieldPiece ({
            id: i,
            pos: [posX, posY],
            radius: this.radius,
            color: this.color,
            Util: Util,
            game: this.game
        });

        shieldPiece.draw(ctx);
        this.game.shieldPieces.push(shieldPiece);

        if (i < 10) { posX += 7; }
        else if (i === 10) { posY -= 7; }
        else if (i < 20) { posX -= 7; }
        else if (i === 20) { posY -= 7; }
    }
};

MediaSourceHandle.exports = Shield;