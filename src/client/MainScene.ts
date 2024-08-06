  import Phaser from 'phaser';
  // import Resource from "./Resource.js";
  import '../assets/images/tileset_dungeon.png';
  import '../assets/images/map.json';
  import Player from "./Player";
  import Enemy from "./Enemy";

  export default class MainScene extends Phaser.Scene {
    private player: Player;
    private enemies: any[];
    private map: Phaser.Tilemaps.Tilemap;
    constructor(){
      super("MainScene");
      this.enemies = [];
    }

    preload() {
      Player.preload(this);
      Enemy.preload(this);
      // Resource.preload(this);
      this.load.image('tiles','assets/images/tileset_dungeon.png');
      this.load.tilemapTiledJSON('map','assets/images/map.json');
    }

    create(){
      const map = this.make.tilemap({key: 'map'});
      this.map = map;
      const tileset = map.addTilesetImage('tileset_dungeon','tiles',32,32,0,0);
      const layer1 = map.createLayer('tile_layer_1',tileset!,0,0);
      // const layer2 = map.createStaticLayer('Tile Layer 2',tileset,0,0);
      layer1!.setCollisionByProperty({collides:true});
      this.matter.world.convertTilemapLayer(layer1!);
      // this.map.getObjectLayer('Resources').objects.forEach(resource =>new Resource({scene:this,resource}));
      this.map.getObjectLayer('enemies')!.objects.forEach(enemy => this.enemies.push(new Enemy({scene:this,enemy})));
      this.player = new Player({scene:this,x:200,y:220,texture:'female',frame:'townsfolk_f_idle_1'});
      this.player.inputKeys = this.input.keyboard!.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      })
    }

    update(){
      this.enemies.forEach(enemy => enemy.update());
      this.player.update();
    }
  }