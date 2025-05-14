const Projectile = require('./projectile');

function Ship(game, pos, image) {
this.game = game;
this.pos = pos;
this.image = image;
this.size = [50, 50];
this.speed = 5;
this.projectileSpeed = -7;
this.coolDownTime = 30;
this.coolDown = 0;
this.lives = 3;
}

Ship.prototype.draw = function(ctx) {
ctx.drawImage(this.image, this.pos[0], this.pos[1], this.size[0], this.size[1]);
};

Ship.prototype.move = function(direction) {
if (direction === 'left') {
    this.pos[0] -= this.speed;
} else if (direction === 'right') {
    this.pos[0] += this.speed;
}
};

Ship.prototype.fire = function() {
if (this.coolDown === 0) {
    const projectile = new Projectile(
    this.game,
    [this.pos[0] + this.size[0] / 2 - 2, this.pos[1]],
    [0, this.projectileSpeed],
    'player'
    );
    this.game.playerProjectiles.push(projectile);
    this.coolDown = this.coolDownTime;
    if (!this.game.audioMuted) this.game.sounds.shoot.play();
}
};

Ship.prototype.coolDown = function() {
if (this.coolDown > 0) this.coolDown -= 1;
};

Ship.prototype.hit = function() {
this.lives -= 1;
if (this.lives <= 0) {
    this.game.pause();
    this.game.hud.gameOver();
}
};

module.exports = Ship;
