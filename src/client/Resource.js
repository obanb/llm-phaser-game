"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
require("../assets/audio/tree.mp3");
require("../assets/audio/rock.mp3");
require("../assets/audio/bush.mp3");
require("../assets/audio/pickup.mp3");
require("../assets/images/resources_atlas.jso");
const MatterEntity_1 = __importDefault(require("./MatterEntity"));
class Resource extends MatterEntity_1.default {
    static preload(scene) {
        scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
        scene.load.audio('tree', 'assets/audio/tree.mp3');
        scene.load.audio('rock', 'assets/audio/rock.mp3');
        scene.load.audio('bush', 'assets/audio/bush.mp3');
        scene.load.audio('pickup', 'assets/audio/pickup.mp3');
    }
    constructor(data) {
        let { scene, resource } = data;
        let drops = JSON.parse(resource.properties.find(p => p.name == 'drops').value);
        let depth = resource.properties.find(p => p.name == 'depth').value;
        super({ scene, x: resource.x, y: resource.y, texture: 'resources', frame: resource.type, drops, depth, health: 5, name: resource.type });
        let yOrigin = resource.properties.find(p => p.name == 'yOrigin').value;
        this.y = this.y + this.height * (yOrigin - 0.5);
        const { Bodies } = phaser_1.default.Physics.Matter.Matter;
        var circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });
        this.setExistingBody(circleCollider);
        this.setStatic(true);
        this.setOrigin(0.5, yOrigin);
    }
}
exports.default = Resource;
