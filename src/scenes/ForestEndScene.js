import Bubu from "../sprites/Bubu.js";
import Andy from "../sprites/Andy.js";
import { GameState } from "../GameState.js";
import BaseScene from "./BaseScene.js";

export default class ForestEndScene extends BaseScene {
    constructor() {
        super('ForestEndScene');
    }

    init(data) {
        this.startPos = {
            x: data.x || 64 * 2 + 32,
            y: data.y || 64 * 2 + 32
        };
    }

    create() {
        super.create();

        this.walls = [];
        this.exits = [];

        const fenceIndex = 6;
        const mapLayout = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [6, 6, 6, 6, 6, 6, 6, 6, 6],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 31, 0, 0, 0, 0],
        ];

        const exitIndices = [20, 21, 22, 23, 31, 32, 33, 34]
        mapLayout.forEach((row, y) => {
            row.forEach((value, x) => {
                const posX = x * 64;
                const posY = y * 64;
                const tileIndex = Math.abs(value);

                if (exitIndices.includes(tileIndex)) {
                    let tile;
                    const cropBottom = new Phaser.Geom.Rectangle(0, 0, 64, 32);
                    const cropTop = new Phaser.Geom.Rectangle(0, 32, 64, 32);
                    const cropLeft = new Phaser.Geom.Rectangle(32, 0, 32, 64);
                    const cropRight = new Phaser.Geom.Rectangle(0, 0, 32, 64);
                    switch (tileIndex) {
                        case 21:
                            tile = this.add.image(posX, posY, 'forest', 1).setOrigin(0);
                            tile.setCrop(cropBottom);
                            break;
                        case 22:
                            tile = this.add.image(posX, posY, 'forest', 1).setOrigin(0);
                            tile.setCrop(cropTop);
                            break;
                        case 23:
                            tile = this.add.image(posX, posY, 'forest', 1).setOrigin(0);
                            tile.setCrop(cropLeft);
                            break;
                        case 24:
                            tile = this.add.image(posX, posY, 'forest', 1).setOrigin(0);
                            tile.setCrop(cropRight);
                            break;
                        case 31:
                            tile = this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                            tile.setCrop(cropBottom);
                            break;
                        case 32:
                            tile = this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                            tile.setCrop(cropTop);
                            break;
                        case 33:
                            tile = this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                            tile.setCrop(cropLeft);
                            break;
                        case 34:
                            tile = this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                            tile.setCrop(cropRight);
                            break;
                    }
                }
                // --- 2. LAYER TWO: GRASS BASE FOR EVERYTHING ELSE ---
                else {
                    // Draw grass first so when flowers are picked, grass is underneath
                    this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                    // --- 3. LAYER THREE: TOP OBJECTS ---
                    if (tileIndex === fenceIndex) {
                        this.add.image(posX, posY, 'fences', 6).setOrigin(0);
                        this.walls.push({ x: posX + 32, y: posY + 32 });
                    }
                }
            });
        });

        this.player = new Bubu(this, this.startPos.x, this.startPos.y);
        this.andy = new Andy(this, 64 * 5 + 32, 64 * 2 + 32);
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Tell Bubu to run her own update logic
        if (this.player) {
            this.player.update(this.andy);
        }

        // Check for interaction
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.handleAndyInteraction()
        }
    }

    handleAndyInteraction() {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.andy.x, this.andy.y);
        if (dist > 80) return;

        const bubuDir = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : '';
        const isFacingAndy = this.checkIfFacing(this.player, this.andy, bubuDir);
        if (!isFacingAndy) return;

        let lines = [];
        let onCompleteAction = null;

        if (GameState.triviaStatus === 'NOT_STARTED') {
            lines = [
                "Hello Bubu! My name is Andy.",
                "If you want to pick flowers on my farm, you'll have to answer some trivia questions.",
                "Get 5 questions in a row correct and I'll let you through."
            ];
            onCompleteAction = () => { GameState.triviaStatus = 'ACTIVE'; };

        } else if (GameState.triviaStatus === 'ACTIVE') {
            // Pick a random question
            const randomIdx = Phaser.Math.Between(0, GameState.triviaQuestions.length - 1);
            const questionData = GameState.triviaQuestions[randomIdx];

            lines = [
                `Question ${GameState.triviaStreak + 1}/5:`,
                questionData.q
            ];

            onCompleteAction = () => {
                // Instead of just finishing, we launch the choice UI
                this.showTriviaChoices(questionData);
            };

        } else if (GameState.triviaStatus === 'COMPLETED') {
            lines = ["You've already proven your flower-knowledge, Bubu!", "Go ahead and pick some flowers!"];
        }

        // Launch the dialogue exactly like you did with Dudu
        if (lines.length > 0) {
            this.scene.pause();
            this.scene.launch('DialogueScene', { lines: lines, onComplete: onCompleteAction });
        }
    }

    showTriviaChoices(questionData) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const buttons = [];

        questionData.a.forEach((option, index) => {
            // Create a button for each answer
            const btn = this.add.text(centerX, centerY - 60 + (index * 50), option, {
                fontSize: '24px',
                backgroundColor: '#000',
                color: '#fff',
                padding: { x: 20, y: 10 },
                fixedWidth: 400,
                align: 'center'
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setDepth(100); // Make sure it's above the map

            btn.on('pointerover', () => btn.setBackgroundColor('#444'));
            btn.on('pointerout', () => btn.setBackgroundColor('#000'));

            btn.on('pointerdown', () => {
                // 1. Destroy all choice buttons
                buttons.forEach(b => b.destroy());

                // 2. Run the answer logic
                this.handleAnswer(index === questionData.correct);
            });

            buttons.push(btn);
        });
    }

    handleAnswer(isCorrect) {
        let lines = [];
        let onComplete = null;

        if (isCorrect) {
            GameState.triviaStreak++;
            if (GameState.triviaStreak >= 5) {
                GameState.triviaStatus = 'COMPLETED';
                lines = ["Amazing! You got 5 in a row!", "The farm gate is now open for you!"];
            } else {
                lines = [`Correct! Just ${5 - GameState.triviaStreak} more to go.`];
            }
        } else {
            GameState.triviaStreak = 0;
            lines = ["Oh no, that's not right!", "You'll have to start your streak over from the beginning."];
        }

        // Show the result dialogue
        this.scene.pause();
        this.scene.launch('DialogueScene', { lines: lines, onComplete: onComplete });
    }

    checkIfFacing(player, target, animKey) {
        const dx = target.x - player.x;
        const dy = target.y - player.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && animKey.includes('right')) return true;
            if (dx < 0 && animKey.includes('left')) return true;
        } else {
            if (dy > 0 && animKey.includes('down')) return true;
            if (dy < 0 && animKey.includes('up')) return true;
        }
        return false;
    }
}