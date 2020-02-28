export default class Saved extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, "para");
        scene.add.existing(this);
        this.play("para_anim");
    }
}