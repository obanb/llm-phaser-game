import Phaser from 'phaser';

import '../assets/images/enemies_atlas.json';
import '../assets/images/enemies_anim.json';
import '../assets/audio/bear.mp3';
import '../assets/audio/wolf.mp3';
import '../assets/audio/ent.mp3';
import '../assets/images/enemies.png';
import MatterEntity from "./MatterEntity";


export default class Enemy extends MatterEntity {
  private attacktimer: any;
  private attacking: any;

  constructor(data){

    super({scene:data.scene,x:data.enemy.x,y:data.enemy.y,texture:'enemies',frame:`${data.enemy.name}_idle_1`,drops: JSON.parse(data.enemy.properties.find(p=>p.name=='drops').value),health:data.enemy.properties.find(p=>p.name=='health').value,name:data.enemy.name});

    console.log(this.scene.textures.get('enemies').getFrameNames());


    const {Body,Bodies} = (Phaser.Physics.Matter as any).Matter;
    var enemyCollider = Bodies.circle(this.x,this.y,12,{isSensor:false,label:'enemyCollider'});
    var enemySensor = Bodies.circle(this.x,this.y,80, {isSensor:true, label:'enemySensor'});
    const compoundBody = Body.create({
      parts:[enemyCollider,enemySensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    (this.scene as any).matterCollision.addOnCollideStart({
      objectA:[enemySensor],
      callback: other => {if(other.gameObjectB && other.gameObjectB.name == 'player') this.attacking = other.gameObjectB;},
      context:this.scene,
    });
  }

  static preload(scene){
    scene.load.atlas('enemies','assets/images/enemies.png','assets/images/enemies_atlas.json');
    scene.load.animation('enemies_anim','assets/images/enemies_anim.json');
    scene.load.audio('bear','assets/audio/bear.mp3');
    scene.load.audio('wolf','assets/audio/wolf.mp3');
    scene.load.audio('ent','assets/audio/ent.mp3');
  }


  attack = (target) => {
    if(target.dead || this.dead) {
      clearInterval(this.attacktimer);
      return;
    }
    target.hit();
  }

  update(){
    if(this.dead) return;
    if(this.attacking){
      let direction = this.attacking.position.subtract(this.position);
      if(direction.length()>24) {
        let v = direction.normalize();
        this.setVelocityX(direction.x);
        this.setVelocityY(direction.y);
        if(this.attacktimer) {
          clearInterval(this.attacktimer);
          this.attacktimer = null;
        }
      } else {
        if(this.attacktimer == null) {
          this.attacktimer = setInterval(this.attack,500,this.attacking);
        }
      }
    }
    this.setFlipX(this.velocity!.x < 0);
    if(Math.abs(this.velocity!.x) > 0.1 || Math.abs(this.velocity!.y) > 0.1) {
      this.anims.play(`${this.name}_walk`,true);
    }else {
      this.anims.play(`${this.name}_idle`,true);
    }


  }
}