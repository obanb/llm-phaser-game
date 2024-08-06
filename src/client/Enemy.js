"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
require("../assets/images/enemies_atlas.json");
require("../assets/images/enemies_anim.json");
require("../assets/audio/bear.mp3");
require("../assets/audio/wolf.mp3");
require("../assets/audio/ent.mp3");
require("../assets/images/enemies.png");
const MatterEntity_1 = __importDefault(require("./MatterEntity"));
const __ws_1 = require("./__ws");
class Enemy extends MatterEntity_1.default {
    attacktimer;
    attacking;
    constructor({ scene, enemy: { x, y, properties, name } }) {
        super({ scene: scene, x, y, texture: 'enemies', frame: `${name}_idle_1`, drops: JSON.parse(properties.find(p => p.name == 'drops').value), health: properties.find(p => p.name == 'health').value, name });
        console.log(this.scene.textures.get('enemies').getFrameNames());
        const { Body, Bodies } = phaser_1.default.Physics.Matter.Matter;
        var enemyCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'enemyCollider' });
        var enemySensor = Bodies.circle(this.x, this.y, 80, { isSensor: true, label: 'enemySensor' });
        const compoundBody = Body.create({
            parts: [enemyCollider, enemySensor],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.scene.matterCollision.addOnCollideStart({
            objectA: [enemySensor],
            callback: other => { if (other.gameObjectB && other.gameObjectB.name == 'player')
                this.attacking = other.gameObjectB; },
            context: this.scene,
        });
        const socket = (0, __ws_1.spawnWsAgent)();
        socket.emit('message', 'im here');
        socket.on('move', (direction) => {
            this.handleMovement(direction);
        });
        socket.emit('message', 'I\'m here');
    }
    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anim', 'assets/images/enemies_anim.json');
        scene.load.audio('bear', 'assets/audio/bear.mp3');
        scene.load.audio('wolf', 'assets/audio/wolf.mp3');
        scene.load.audio('ent', 'assets/audio/ent.mp3');
    }
    handleMovement(direction) {
        // Example: Move the enemy based on the direction received
        this.setVelocityX(direction.x);
        this.setVelocityY(direction.y);
    }
    attack = (target) => {
        if (target.dead || this.dead) {
            clearInterval(this.attacktimer);
            return;
        }
        target.hit();
    };
    update() {
        if (this.dead)
            return;
        if (this.attacking) {
            let direction = this.attacking.position.subtract(this.position);
            if (direction.length() > 24) {
                direction.normalize();
                this.setVelocityX(direction.x);
                this.setVelocityY(direction.y);
                if (this.attacktimer) {
                    clearInterval(this.attacktimer);
                    this.attacktimer = null;
                }
            }
            else {
                if (this.attacktimer == null) {
                    this.attacktimer = setInterval(this.attack, 500, this.attacking);
                }
            }
        }
        this.setFlipX(this.velocity.x < 0);
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play(`${this.name}_walk`, true);
        }
        else {
            this.anims.play(`${this.name}_idle`, true);
        }
    }
}
exports.default = Enemy;
