import ExampleObject from '../objects/exampleObject';
import Beam from '../objects/beam';
import Saved from '../objects/saved';
import { Scene } from 'phaser';
//import config from '/Users/yasser.abdelaal/Documents/CISC374 Projects/Project 2/coding-2-try-phaser-ayasser3/src/scripts/game';
export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background;
  private ship1;
  private ship2;
  private ship3;
  private powerUps;
  public player;
  private cursorKeys;
  private spacebar;
  private projectiles;
  private enemies;
  private score;
  private scoreLabel;
  private beamSound;
  private explosionSound;
  private pickupSound;
  private music;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    //this.exampleObject = new ExampleObject(this, 0, 0);

    this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, "cloud").setOrigin(0, 0);
    // this.ship1 = this.add.image(400/2 - 50, 400/2, "ship");
    // this.ship2 = this.add.image(400/2, 400/2, "ship2");
    // this.ship3 = this.add.image(400/2 + 50, 400/ 2, "ship3");
    this.ship1 = this.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "diving");
    this.ship2 = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "diving");
    this.ship3 = this.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "diving");
    
    

    this.powerUps = this.physics.add.group();

    let maxObjects: number = 4;
    for(let i: number = 0; i <= maxObjects; i++){
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, this.scale.width, this.scale.height);

      if(Math.random() > .5){
        powerUp.play("red");
      }else{
        powerUp.play("gray");
      }

      powerUp.setVelocity(100,100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);

    }

    this.projectiles = this.add.group({
      classType: Beam,
      maxSize:10, 
      runChildUpdate: true
    });

    this.ship1.play("ship1_anim");
    this.ship2.play("ship1_anim");
    this.ship3.play("ship1_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown', this.saveGuy, this);

    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);
    
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){
      projectile.destroy();
    });

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);


    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, undefined, this);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(this.scale.width, 0);
    graphics.lineTo(this.scale.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16);

    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_xplode");
    this.pickupSound = this.sound.add("audio_pickup");

    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false, 
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    this.music.play(musicConfig);

  }

  zeroPad(number, size){
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)){
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  hitEnemy(projectile, enemy){
    var save = new Saved(this, enemy.x, enemy.y);
    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;
    var scoreFormatted = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormatted; 

    this.explosionSound.play();
  }

  hurtPlayer(player, enemy){
    this.resetShipPos(enemy);

    if(this.player.alpha < 1){
      return;
    }

    var save = new Saved(this, player.x, player.y);
    player.disableBody(true, true);

    // this.resetPlayer();
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this, 
      loop: false
    });
  }

  resetPlayer(){
    var x = this.scale.width / 2 - 8;
    var y = this.scale.height + 64;
    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = .5;

    var tween = this.tweens.add({
      targets: this.player,
      y: this.scale.height - 64,
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      onComplete: function(){
        this.player.alpha = 1
      },
      callbackScope: this
    });
  }

  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);

    this.pickupSound.play();
  }

  moveShip(ship, speed){
    ship.y += speed;
    if(ship.y > this.scale.height){
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship){
    ship.y = 0;
    let randomX:number = Phaser.Math.Between(0, this.scale.width);
    ship.x = randomX;
  }

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);
    this.background.tilePositionY -= .5;
    this.movePlayerManager();

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      if(this.player.active){
        this.shootBeam();
      }
    }

    

    // for(var i = 0; i < this.projectiles.getChildren().length; i++){
    //   var beam = this.projectiles.getChildren()[i];
    //   beam.update();
    // }

  }

  movePlayerManager(){
    if(this.cursorKeys.left.isDown){
      this.player.setVelocityX(-200);
    }else if(this.cursorKeys.right.isDown){
      this.player.setVelocityX(200);
    }
    else{
      this.player.setVelocityX(0);
    }

    if(this.cursorKeys.up.isDown){
      this.player.setVelocityY(-200);
    }else if(this.cursorKeys.down.isDown){
      this.player.setVelocityY(200);
    }
    else{
      this.player.setVelocityY(0);
    }
  }

  saveGuy(pointer, gameObject){
    gameObject.setTexture("para");
    gameObject.play("para_anim");
  }

  shootBeam(){
    var beam = new Beam(this);
    this.beamSound.play();
  }

  
}
