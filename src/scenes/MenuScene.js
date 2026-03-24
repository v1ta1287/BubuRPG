// MainMenuScene.js
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. Add a Background (Optional: can just be a color)
        this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0);

        // 2. Title Text
        this.add.text(width / 2, height / 3, "BubuRPG", {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 3. Play Button
        const playButton = this.add.text(width / 2, height / 2 + 50, 'PLAY GAME', {
            fontSize: '32px',
            fontFamily: 'Arial',
            backgroundColor: '#44aa44',
            color: '#ffffff',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // --- Interactivity ---

        // Hover effects
        playButton.on('pointerover', () => playButton.setBackgroundColor('#55cc55'));
        playButton.on('pointerout', () => playButton.setBackgroundColor('#44aa44'));

        // Click to Start
        playButton.on('pointerdown', () => {
            // 1. Disable the button so the user can't click it multiple times during the fade
            playButton.disableInteractive();

            // 2. Start the fade out (1000ms = 1 second)
            this.cameras.main.fadeOut(1000, 0, 0, 0);

            // 3. When the fade is finished, switch scenes
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {

                // Start the music right before switching
                // Note: Using this.sound.add here is fine, but if you want it to persist 
                // through scenes, ensure your other scenes don't try to stop all sounds.
                const bgMusic = this.sound.add('bgmusic', {
                    volume: 0.5,
                    loop: true
                });
                bgMusic.play();

                this.scene.start('HomeScene');
            });
        });
    }
}