import Phaser from 'phaser';
import DropItem from "./DropItem";

import './assets/images/enemies_atlas.json';
import './assets/images/enemies_anim.json';
import './assets/audio/bear.mp3';
import './assets/audio/wolf.mp3';
import './assets/audio/ent.mp3';
import './assets/images/enemies.png';

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
  private health: any;
  private drops: any;
  private _position: any
  private sound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  constructor(data){
    super(data.scene.matter.world,data.x,data.y,data.texture,data.frame);
    this.x += this.width/2;
    this.y -= this.height/2;
    this.depth = data.depth || 1;
    this.name = data.name;
    this.health = data.health;
    this.drops = data.drops;
    this._position = new Phaser.Math.Vector2(this.x,this.y);
    // if(this.name) this.sound = this.scene.sound.add(this.name);
    (this.scene.add.existing as any)(this);
  }

  get position() {
    this._position.set(this.x,this.y);
    return this._position;
  }

  get velocity() {
    return this.body?.velocity;
  }

  get dead() {
    return this.health <= 0;
  }

  onDeath = () =>{};

  hit = ()=>{
    if(this.sound) this.sound.play();
    this.health--;
    console.log(`Hitting:${this.name} Health:${this.health}`);
    if(this.dead){
      this.onDeath();
      this.drops.forEach(drop => new DropItem({scene:this.scene,x:this.x,y:this.y,frame:drop}));
    }
  }


}