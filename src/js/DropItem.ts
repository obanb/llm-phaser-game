import Phaser from 'phaser';

export default class DropItem extends Phaser.Physics.Matter.Sprite {
  private sound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  constructor(data: any){
    super(data.scene.matter.world,data.x,data.y,'items',data.frame);
    // TODO
    this.scene.add.existing(this as any);
    const {Bodies} = (Phaser.Physics.Matter as any).Matter;
    var circleCollider = Bodies.circle(this.x,this.y,10,{isSensor:false,label:'collider'});
    this.setExistingBody(circleCollider);
    this.setFrictionAir(1);
    this.setScale(0.5);
    this.sound = this.scene.sound.add('pickup');
  }

  pickup = () => {
    this.destroy();
    this.sound.play();
    return true;
  }
}