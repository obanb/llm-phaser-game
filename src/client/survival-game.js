"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const phaser_matter_collision_plugin_1 = __importDefault(require("phaser-matter-collision-plugin"));
const MainScene_1 = __importDefault(require("./MainScene"));
const config = {
    width: 512,
    height: 512,
    backgroundColor: '#999999',
    type: phaser_1.default.AUTO,
    parent: 'survival-game',
    scene: [MainScene_1.default],
    scale: {
        zoom: 2,
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { y: 0 },
        }
    },
    plugins: {
        scene: [
            {
                plugin: phaser_matter_collision_plugin_1.default,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
    }
};
new phaser_1.default.Game(config);
