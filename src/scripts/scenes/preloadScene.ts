export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("sunset", "assets/8bitsunset.jpg");
    this.load.image("cloud", "assets/clouds.png");
    this.load.image("ship", "assets/ship.png");
    this.load.image("ship2", "assets/ship2.png");
    this.load.image("ship3", "assets/ship3.png");

    this.load.bitmapFont("pixelFont", "assets/font.png", "assets/font.xml");
    
    this.load.audio("audio_beam", ["assets/beam.ogg", "assets/beam.mp3"]);
    this.load.audio("audio_xplode", ["assets/explosion.ogg", "assets/explosion.mp3"]);
    this.load.audio("audio_pickup", ["assets/pickup.ogg", "assets/pickup.mp3"]);
    this.load.audio("music", ["assets/sci-fi_platformer12.ogg", "assets/sci-fi_platformer12.mp3"]);

    this.load.spritesheet("diving", "assets/diving.png", {
      frameWidth: 22,
      frameHeight: 25
    });
    this.load.spritesheet("para", "assets/parachute.png", {
      frameWidth: 90,
      frameHeight: 48
    });

    this.load.spritesheet("power-up", "assets/power-up.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 16,
      frameHeight: 24
    });

    this.load.spritesheet("beam", "assets/beam.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.add.text(20, 20, "Loading game...", {color: 'black'});
    this.scene.start('MainScene');

    this.anims.create({
      key:"ship1_anim",
      frames: this.anims.generateFrameNumbers("diving", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key:"ship2_anim",
      frames: this.anims.generateFrameNumbers("diving", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key:"ship3_anim",
      frames: this.anims.generateFrameNumbers("diving", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key:"para_anim",
      frames: this.anims.generateFrameNumbers("para", {
        start: 0,
        end: 8
      }),
      frameRate: 9,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3
      }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });
    
    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });
  }
}
