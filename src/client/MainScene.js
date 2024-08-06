"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
// import Resource from "./Resource.js";
require("../assets/images/tileset_dungeon.png");
require("../assets/images/map.json");
const Player_1 = __importDefault(require("./Player"));
const Enemy_1 = __importDefault(require("./Enemy"));
class MainScene extends phaser_1.default.Scene {
    player;
    enemies;
    map;
    constructor() {
        super("MainScene");
        this.enemies = [];
    }
    preload() {
        Player_1.default.preload(this);
        Enemy_1.default.preload(this);
        // Resource.preload(this);
        this.load.image('tiles', 'assets/images/tileset_dungeon.png');
        this.load.tilemapTiledJSON('map', 'assets/images/map.json');
    }
    create() {
        const map = this.make.tilemap({ key: 'map' });
        this.map = map;
        const tileset = map.addTilesetImage('tileset_dungeon', 'tiles', 32, 32, 0, 0);
        const layer1 = map.createLayer('tile_layer_1', tileset, 0, 0);
        // const layer2 = map.createStaticLayer('Tile Layer 2',tileset,0,0);
        layer1.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(layer1);
        // this.map.getObjectLayer('Resources').objects.forEach(resource =>new Resource({scene:this,resource}));
        this.map.getObjectLayer('enemies').objects.forEach(enemy => this.enemies.push(new Enemy_1.default({ scene: this, enemy })));
        this.player = new Player_1.default({ scene: this, x: 200, y: 220, texture: 'female', frame: 'townsfolk_f_idle_1' });
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: phaser_1.default.Input.Keyboard.KeyCodes.W,
            down: phaser_1.default.Input.Keyboard.KeyCodes.S,
            left: phaser_1.default.Input.Keyboard.KeyCodes.A,
            right: phaser_1.default.Input.Keyboard.KeyCodes.D,
            enter: phaser_1.default.Input.Keyboard.KeyCodes.ENTER,
        });
    }
    update() {
        this.enemies.forEach(enemy => enemy.update());
        this.player.update();
    }
}
exports.default = MainScene;
