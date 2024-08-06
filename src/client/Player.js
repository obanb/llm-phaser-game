"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
require("../assets/images/female_atlas.json");
require("../assets/images/female_anim.json");
require("../assets/images/female.png");
require("../assets/images/items.png");
require("../assets/audio/player.mp3");
const MatterEntity_1 = __importDefault(require("./MatterEntity"));
const TextWindow_1 = __importDefault(require("./TextWindow"));
class Player extends MatterEntity_1.default {
    inputKeys;
    spriteWeapon;
    touching;
    textBubble;
    weaponRotation;
    textWindow;
    constructor(data) {
        // let {scene,x,y,texture,frame} = data;
        super({ ...data, health: 2, drops: [], name: 'player' });
        this.touching = [];
        this.textWindow = new TextWindow_1.default(this.scene, data.x, data.y - 100, 200, 50);
        //Weapon
        this.textBubble = this.scene.add.text(data.x, data.y - 50, 'Hello!', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000'
        });
        this.spriteWeapon = new phaser_1.default.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
        this.spriteWeapon.setScale(0.8);
        this.spriteWeapon.setOrigin(0.25, 0.75);
        this.scene.add.existing(this.spriteWeapon);
        const { Body, Bodies } = phaser_1.default.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' });
        var playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'playerSensor' });
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.CreateMiningCollisions(playerSensor);
        this.CreatePickupCollisions(playerCollider);
        this.scene.input.on('pointermove', pointer => { if (!this.dead)
            this.setFlipX(pointer.worldX < this.x); });
        this.scene.input.keyboard.on('keydown', this.handleKeyInput, this);
    }
    handleKeyInput(event) {
        if (event.key === 'Enter') {
            if (!this.textWindow.isOpened) {
                this.textWindow.show();
            }
            else {
                this.textWindow.hide();
            }
        }
        if (event.key === 'Backspace' && this.textWindow.isOpened) {
            this.textWindow.removeLastCharacter();
        }
        else if (/^[a-zA-Z0-9]$/.test(event.key)) {
            // Check if the key is a letter (a-z, A-Z) or a number (0-9)
            this.textWindow.addText(event.key);
        }
    }
    updateTextBubblePosition() {
        this.textBubble.setPosition(this.x - this.textBubble.width / 2, this.y - this.height - 10);
    }
    static preload(scene) {
        scene.load.atlas('female', 'assets/images/female.png', 'assets/images/female_atlas.json');
        scene.load.animation('female_anim', 'assets/images/female_anim.json');
        scene.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
        scene.load.audio('player', 'assets/audio/player.mp3');
    }
    onDeath = () => {
        this.anims.stop();
        this.setTexture('items', 0);
        this.setOrigin(0.5);
        this.spriteWeapon.destroy();
    };
    update() {
        if (this.dead)
            return;
        const speed = 2.5;
        let playerVelocity = new phaser_1.default.Math.Vector2();
        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        }
        else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }
        if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        }
        else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play('female_walk', true);
        }
        else {
            this.anims.play('female_idle', true);
        }
        this.spriteWeapon.setPosition(this.x, this.y);
        this.weaponRotate();
        this.updateTextBubblePosition();
        this.textWindow.setPosition(this.x, this.y - 100);
    }
    showTextWindow(message) {
        this.textWindow.show();
    }
    // Method to hide the text window
    hideTextWindow() {
        this.textWindow.hide();
    }
    weaponRotate() {
        let pointer = this.scene.input.activePointer;
        if (pointer.isDown) {
            this.weaponRotation += 6;
        }
        else {
            this.weaponRotation = 0;
        }
        if (this.weaponRotation > 100) {
            this.whackStuff();
            this.weaponRotation = 0;
        }
        if (this.flipX) {
            this.spriteWeapon.setAngle(-this.weaponRotation - 90);
        }
        else {
            this.spriteWeapon.setAngle(this.weaponRotation);
        }
    }
    CreateMiningCollisions(playerSensor) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if (other.bodyB.isSensor)
                    return;
                this.touching.push(other.gameObjectB);
                console.log(this.touching.length, other.gameObjectB.name);
            },
            context: this.scene,
        });
        this.scene.matterCollision.addOnCollideEnd({
            objectA: [playerSensor],
            callback: other => {
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                console.log(this.touching.length);
            },
            context: this.scene,
        });
    }
    CreatePickupCollisions(playerCollider) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerCollider],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.pickup)
                    other.gameObjectB.pickup();
            },
            context: this.scene,
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: [playerCollider],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.pickup)
                    other.gameObjectB.pickup();
            },
            context: this.scene,
        });
    }
    whackStuff() {
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
        this.touching.forEach(gameobject => {
            gameobject.hit();
            if (gameobject.dead)
                gameobject.destroy();
        });
    }
}
exports.default = Player;
