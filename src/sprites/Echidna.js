export default class Echidna extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'echidna', 7);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.setScale(0.5);
        this.setImmovable(true);

        // This tells the physics engine the 'real' height is 275
        // We use the unscaled numbers here
        this.body.setSize(64, 64);

        // This 'shaves' 20px off the top by moving the hitbox down 
        // relative to the top of the image
        this.body.setOffset(-20, 25);

        // Play an idle animation if you have one
        this.play('echidna-idle', true);
    }
}