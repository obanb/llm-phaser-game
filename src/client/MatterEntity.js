"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const DropItem_1 = __importDefault(require("./DropItem"));
require("../assets/images/enemies_atlas.json");
require("../assets/images/enemies_anim.json");
require("../assets/audio/bear.mp3");
require("../assets/audio/wolf.mp3");
require("../assets/audio/ent.mp3");
require("../assets/images/enemies.png");
class MatterEntity extends phaser_1.default.Physics.Matter.Sprite {
    health;
    drops;
    _position;
    sound;
    constructor(data) {
        super(data.scene.matter.world, data.x, data.y, data.texture, data.frame);
        this.x += this.width / 2;
        this.y -= this.height / 2;
        this.depth = data.depth || 1;
        this.name = data.name;
        this.health = data.health;
        this.drops = data.drops;
        this._position = new phaser_1.default.Math.Vector2(this.x, this.y);
        // if(this.name) this.sound = this.scene.sound.add(this.name);
        this.scene.add.existing(this);
    }
    get position() {
        this._position.set(this.x, this.y);
        return this._position;
    }
    get velocity() {
        return this.body?.velocity;
    }
    get dead() {
        return this.health <= 0;
    }
    onDeath = () => { };
    hit = () => {
        if (this.sound)
            this.sound.play();
        this.health--;
        console.log(`Hitting:${this.name} Health:${this.health}`);
        if (this.dead) {
            this.onDeath();
            this.drops.forEach(drop => new DropItem_1.default({ scene: this.scene, x: this.x, y: this.y, frame: drop }));
        }
    };
}
exports.default = MatterEntity;
