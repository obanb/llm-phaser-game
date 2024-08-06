"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
class DropItem extends phaser_1.default.Physics.Matter.Sprite {
    sound;
    constructor(data) {
        super(data.scene.matter.world, data.x, data.y, 'items', data.frame);
        // TODO
        this.scene.add.existing(this);
        const { Bodies } = phaser_1.default.Physics.Matter.Matter;
        var circleCollider = Bodies.circle(this.x, this.y, 10, { isSensor: false, label: 'collider' });
        this.setExistingBody(circleCollider);
        this.setFrictionAir(1);
        this.setScale(0.5);
        this.sound = this.scene.sound.add('pickup');
    }
    pickup = () => {
        this.destroy();
        this.sound.play();
        return true;
    };
}
exports.default = DropItem;
