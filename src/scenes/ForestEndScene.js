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
        const treeIndex = 5;
        const mapLayout = [
            [5, 0, 0, 0, 32, 0, 0, 0, 5],
            [6, 6, 6, 6, 6, 6, 6, 6, 6],
            [5, 0, 0, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 0, 0, 0, 0, 5],
            [5, 5, 5, 5, 31, 5, 5, 5, 5],
        ];

        const bottomExitIndex = 31;
        const topExitIndex = 32;

        mapLayout.forEach((row, y) => {
            row.forEach((value, x) => {
                const posX = x * 64;
                const posY = y * 64;
                const tileIndex = Math.abs(value);

                let tile;

                if (tileIndex == bottomExitIndex) {
                    const cropBottom = new Phaser.Geom.Rectangle(0, 0, 64, 32);
                    tile = this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                    tile.setCrop(cropBottom);
                    this.exits.push({
                        x: posX + 32, y: posY + 32,
                        mapID: 'forest_4',
                        target: 'ForestScene', direction: 'down',
                        spawnX: 64 * 4 + 32, spawnY: 64 * 0 + 32
                    });
                }
                else if (tileIndex == topExitIndex) {
                    const cropTop = new Phaser.Geom.Rectangle(0, 32, 64, 32);
                    tile = this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                    tile.setCrop(cropTop);
                    this.exits.push({
                        x: posX + 32, y: posY + 32,
                        target: 'EchidnaScene', direction: 'up',
                        spawnX: 64 * 4 + 32, spawnY: 64 * 6 + 32
                    });
                }
                // --- 2. LAYER TWO: GRASS BASE FOR EVERYTHING ELSE ---
                else {
                    // Draw grass first so when flowers are picked, grass is underneath
                    this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                    // --- 3. LAYER THREE: TOP OBJECTS ---
                    if (tileIndex === fenceIndex) {
                        // Check for the gate position (Row 1, Column 4)
                        if (y === 1 && x === 4) {
                            if (GameState.triviaStatus !== 'COMPLETED') {
                                const fence = this.add.image(posX, posY, 'fences', 6).setOrigin(0);
                                this.gateTile = fence;
                                this.walls.push({ x: posX + 32, y: posY + 32 });
                            }
                        } else {
                            const fence = this.add.image(posX, posY, 'fences', 6).setOrigin(0);
                            this.walls.push({ x: posX + 32, y: posY + 32 });
                        }
                    }
                    else if (tileIndex === treeIndex) {
                        this.add.image(posX, posY, 'forest2', tileIndex).setOrigin(0);
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

        this.sound.play('button', { volume: 0.2, detune: Phaser.Math.Between(-100, 100) });
        if (GameState.triviaStatus === 'NOT_STARTED') {
            lines = [
                "Hello Bubu! My name is Andy.",
                "If you want to pick flowers on my farm, you'll have to answer some trivia questions.",
                "Get 10 questions in a row correct and I'll let you through."
            ];
            onCompleteAction = () => { GameState.triviaStatus = 'ACTIVE'; };

        } else if (GameState.triviaStatus === 'ACTIVE') {
            const questionData = GameState.triviaQuestions[GameState.triviaStreak];

            // Shorten the prompt since the question appears with the buttons
            lines = [`Question ${GameState.triviaStreak + 1}/10 incoming...`];

            onCompleteAction = () => {
                this.showTriviaChoices(questionData);
            };

        } else if (GameState.triviaStatus === 'COMPLETED') {
            lines = ["You've proven your Knowledge Bubu.", "Go ahead and pick some flowers!"];
        }

        // Launch the dialogue exactly like you did with Dudu
        if (lines.length > 0) {
            this.scene.pause();
            this.scene.launch('DialogueScene', { lines: lines, onComplete: onCompleteAction });
        }
    }

    openGate() {
        if (!this.gateTile) return;

        // 1. Immediate Collision Removal (Matches your flower logic)
        // This lets Bubu walk through the gap the moment the animation starts
        const gateX = 4 * 64 + 32;
        const gateY = 1 * 64 + 32;
        this.walls = this.walls.filter(w => !(w.x === gateX && w.y === gateY));

        // 2. Visual "Dissolve" Animation
        this.tweens.add({
            targets: this.gateTile,
            y: this.gateTile.y - 40, // Floats up slightly higher than a flower
            alpha: 0,               // Fades to invisible
            duration: 800,          // Slightly slower than flowers for "importance"
            ease: 'Power2',
            onComplete: () => {
                this.gateTile.destroy();
                // Ensure the scene is resumed so Bubu can move
                this.scene.resume();
            }
        });
    }

    showTriviaChoices(questionData) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const buttons = [];

        const bgDimmer = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6)
            .setOrigin(0)
            .setDepth(99); // Just below the buttons (100)

        // --- NEW: Add the Question Text above the buttons ---
        const questionText = this.add.text(centerX, centerY - 150, questionData.q, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
            wordWrap: { width: 500 },
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        questionData.a.forEach((option, index) => {
            const btn = this.add.text(centerX, centerY - 40 + (index * 60), option, {
                fontSize: '22px',
                backgroundColor: '#000',
                color: '#fff',
                padding: { x: 20, y: 10 },
                fixedWidth: 400,
                align: 'center'
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setDepth(100);

            btn.on('pointerover', () => btn.setBackgroundColor('#444'));
            btn.on('pointerout', () => btn.setBackgroundColor('#000'));

            btn.on('pointerdown', () => {
                // 1. Clean up EVERYTHING (buttons AND the question text)
                buttons.forEach(b => b.destroy());
                questionText.destroy();
                bgDimmer.destroy();

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
            if (GameState.triviaStreak >= 10) {
                GameState.triviaStatus = 'COMPLETED';
                lines = ["Amazing! You got 10 in a row!", "The farm gate is now open for you!"];
                onComplete = () => { this.openGate(); };
            } else {
                lines = [`Correct! Just ${10 - GameState.triviaStreak} more to go.`];
                // FIX: This triggers the next question
                onComplete = () => { this.handleAndyInteraction(); };
            }
        } else {
            GameState.triviaStreak = 0;
            lines = ["Oh no, that's not right!", "You'll have to start your streak over from the beginning."];
        }

        // Ensure the scene is paused before launching the result dialogue
        this.scene.pause();
        this.scene.launch('DialogueScene', { lines: lines, onComplete: onComplete });
        this.scene.bringToTop('DialogueScene');
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