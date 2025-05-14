const Defender = require('./defender');
const Enemy = require('./enemy');
const Projectile = require('./projectile');
const Ufo = require('./ufo');
const Explosion = require('./explosion');
const HUD = require('./hud');

function GameView(ctx, canvasSize) {
this.ctx = ctx;
this.canvasSize = canvasSize;
this.defender = new Defender(this);
this.enemies = [];
this.enemyProjectiles = [];
this.playerProjectiles = [];
this.explosions = [];
this.ufo = null;
this.hud = new HUD(this);
this.playing = false;
this.showMenu = false;
this.frames = 0;
this.audioMuted = false;

this.sounds = {
    shoot: new Howl({ src: ['./audio/shoot.wav'] }),
    explosion: new Howl({ src: ['./audio/explosion.wav'] }),
    ufo: new Howl({ src: ['./audio/ufo.wav'], loop: true }),
    ufoDeath: new Howl({ src: ['./audio/ufo-death.wav'] }),
    theme: new Howl({ src: ['./audio/theme.mp3'], loop: true }),
};
}

GameView.prototype.welcome = function() {
this.hud.drawWelcome();
};

GameView.prototype.start = function() {
this.reset();
this.playing = true;
this.sounds.theme.play();
requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.pause = function() {
this.playing = false;
this.sounds.theme.pause();
};

GameView.prototype.resume = function() {
this.playing = true;
this.sounds.theme.play();
requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.reset = function() {
this.defender.reset();
this.enemies = Enemy.createEnemies(this);
this.enemyProjectiles = [];
this.playerProjectiles = [];
this.explosions = [];
this.ufo = null;
this.frames = 0;
};

GameView.prototype.animate = function() {
if (!this.playing) return;

this.frames++;

this.ctx.clearRect(0, 0, this.canvasSize[0], this.canvasSize[1]);

this.step();
this.draw();

requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.step = function() {
this.defender.move();
this.defender.coolDown();

this.enemies.forEach(enemy => enemy.move());
this.enemyProjectiles.forEach(p => p.move());
this.playerProjectiles.forEach(p => p.move());
this.explosions.forEach(e => e.animate());

if (this.ufo) this.ufo.move();

this.checkCollisions();
};

GameView.prototype.draw = function() {
this.defender.draw(this.ctx);
this.enemies.forEach(enemy => enemy.draw(this.ctx));
this.enemyProjectiles.forEach(p => p.draw(this.ctx));
this.playerProjectiles.forEach(p => p.draw(this.ctx));
this.explosions.forEach(e => e.draw(this.ctx));

if (this.ufo) this.ufo.draw(this.ctx);

this.hud.draw();
};

GameView.prototype.checkCollisions = function() {
this.enemies.forEach(enemy => {
    this.playerProjectiles.forEach(p => {
    if (p.collidesWith(enemy)) {
        this.explosions.push(new Explosion(this.ctx, enemy.pos));
        this.removeProjectile(p);
        this.removeEnemy(enemy);
        this.hud.addScore(enemy.points);
        this.sounds.explosion.play();
    }
    });
});

this.enemyProjectiles.forEach(p => {
    if (p.collidesWith(this.defender)) {
    this.explosions.push(new Explosion(this.ctx, this.defender.pos));
    this.defender.hit();
    this.removeProjectile(p);
    }
});

if (this.ufo) {
    this.playerProjectiles.forEach(p => {
    if (p.collidesWith(this.ufo)) {
        this.explosions.push(new Explosion(this.ctx, this.ufo.pos));
        this.hud.addScore(this.ufo.points);
        this.removeProjectile(p);
        this.ufo = null;
        this.sounds.ufoDeath.play();
        this.sounds.ufo.stop();
    }
    });
}
};

GameView.prototype.removeProjectile = function(projectile) {
this.playerProjectiles = this.playerProjectiles.filter(p => p !== projectile);
this.enemyProjectiles = this.enemyProjectiles.filter(p => p !== projectile);
};

GameView.prototype.removeEnemy = function(enemy) {
this.enemies = this.enemies.filter(e => e !== enemy);
};

GameView.prototype.toggleAudio = function() {
this.audioMuted = !this.audioMuted;
Howler.mute(this.audioMuted);
};

module.exports = GameView;
