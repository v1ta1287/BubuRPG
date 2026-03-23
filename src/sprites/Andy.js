export default class Andy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'andy', 0); // Ensure 'dudu' is loaded in preload

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.12);
        this.setImmovable(true); // So Bubu can't push him around

        // This tells the physics engine the 'real' height is 275
        // We use the unscaled numbers here
        this.body.setSize(252, 265);

        // This 'shaves' 20px off the top by moving the hitbox down 
        // relative to the top of the image
        this.body.setOffset(-20, 25);

        // Play an idle animation if you have one
        this.play('andy-idle', true);
    }
}