import Bubu from "../sprites/bubu.js";
import Dudu from "../sprites/Dudu.js";
import { dialogueInteraction } from "../interactions.js";

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super('HomeScene');
    }

    preload() {
        // NPCs
        this.load.spritesheet('player', 'assets/lilbubu.png', { frameWidth: 212, frameHeight: 315 });
        this.load.spritesheet('dudu', 'assets/lildudu.png', { frameWidth: 212, frameHeight: 315 })
        // Tilesets
        this.load.spritesheet('house', 'assets/house.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        // Scene containers
        this.walls = [];
        this.exits = [];

        // Constants
        const mapLayout = [
            [0, 0, 0, 0, 6, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 4, -3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        const obstacleTileIndices = [3, 4];
        const exitTiles = [6];

        mapLayout.forEach((row, y) => {
            row.forEach((value, x) => {
                const posX = x * 64;
                const posY = y * 64;

                // Use Math.abs() to get the actual frame index (e.g., -3 becomes 3)
                const tileIndex = Math.abs(value);

                // Draw the tile
                const tile = this.add.image(posX, posY, 'house', tileIndex).setOrigin(0);

                // If the original value was negative, flip it!
                if (value < 0) {
                    tile.setFlipX(true);

                    // Note: Flipping an image with origin(0) moves it out of the tile.
                    // We must adjust the origin to the center to flip in place.
                    tile.setOrigin(0.5);
                    tile.setPosition(posX + 32, posY + 32);
                }

                // Add to walls if it's a wall tile (frame 1)
                if (obstacleTileIndices.includes(tileIndex)) {
                    this.walls.push({ x: posX + 32, y: posY + 32 });
                }

                if (exitTiles.includes(tileIndex)) {
                    this.exits.push({ x: posX + 32, y: posY + 32, target: 'ForestScene', direction: 'up' });
                }
            });
        });

        // Characters
        this.player = new Bubu(this, 64 * 4 + 32, 64 * 3 + 32);
        this.dudu = new Dudu(this, 64 * 6 + 32, 64 + 32);

        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Tell Bubu to run her own update logic
        if (this.player) {
            this.player.update(this.dudu);
        }

        // Check for interaction
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            dialogueInteraction(this.player, this.dudu, "Ello beanie", this)
        }
    }
}