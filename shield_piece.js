const ShieldPiece = function(opitions) {
    this.id = opitions.id;
    this.pos = opitions.pos;
    this.radius = opitions.radius;
    this.color = opitions.color;
    this.util = opitions.util;
    this.game = opitions.game;
};

ShieldPiece.prototype.move = function() {
    //padrão não fazer nada
};

ShieldPiece.prototype.draw = funcion(ctx) 
{
    ctx.fillStyle = this.color;

    ctx.fillRect(
        this.pos[0],
        this.pos[1],
        this.radius,
        this.radius
    );
};

ShieldPiece.prototype.isCollidedWith = function(otherObject) {
    let radiusSum = this.radius + otherObject.radius;
    const centerDiff = this.util.dist(this.pos, otherObject.pos);
    return centerDiff < radiusSum;
};

ShieldPiece.prototype.collideWith = function(otherObject) {
    // padrão não fazer nada
};

module.exports = ShieldPiece;