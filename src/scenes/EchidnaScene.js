import Bubu from "../sprites/Bubu.js";
import { GameState } from "../GameState.js";
import { ForestMaps } from "../Maps.js";
import BaseScene from "./BaseScene.js";
import Echidna from "../sprites/Echidna.js";

export default class EchidnaScene extends BaseScene {
    constructor() {
        super('EchidnaScene');
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
        this.flowerObjects = [];
        this.exits = [];

        const mapLayout = [
            [5, 5, 5, 5, 5, 5, 5, 5, 5],
            [5, 0, 0, 0, 0, 0, 0, 2, 5],
            [5, 0, 2, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 0, 0, 2, 0, 5],
            [5, 2, 0, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 0, 0, 0, 2, 5],
            [5, 5, 5, 5, 31, 5, 5, 5, 5],
        ];

        const flowerIndices = [2, 3, 4];
        const treeIndex = 5;
        const bottomExitIndex = 31;

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
                        target: 'ForestEndScene', direction: 'down',
                        spawnX: 64 * 4 + 32, spawnY: 64 * 0 + 32
                    });
                }
                // --- 2. LAYER TWO: GRASS BASE FOR EVERYTHING ELSE ---
                else {
                    // Draw grass first so when flowers are picked, grass is underneath
                    this.add.image(posX, posY, 'forest', 0).setOrigin(0);
                    // --- 3. LAYER THREE: TOP OBJECTS ---
                    if (flowerIndices.includes(tileIndex)) {
                        const flowerId = `flower_${x}_${y}`;

                        // Only draw flower and add wall if it hasn't been picked
                        if (!GameState.pickedItemsEchidna.has(flowerId)) {
                            const flower = this.add.image(posX, posY, 'forest2', tileIndex).setOrigin(0);
                            flower.setData('id', flowerId);
                            flower.setData('type', this.getFlowerType(tileIndex));

                            this.flowerObjects.push(flower);
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
        this.echidna = new Echidna(this, 64 * 4 + 32, 64 + 32);
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        this.player.update(this.echidna);

        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.attemptFlowerPickup();
            this.handleEchidnaInteraction();
        }
    }

    attemptFlowerPickup() {
        this.flowerObjects.forEach((flower, index) => {
            if (!flower.active) return;

            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                flower.x + 32, flower.y + 32
            );

            if (dist < 75) {
                const bubuDir = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : '';

                if (this.checkIfFacing(this.player, { x: flower.x + 32, y: flower.y + 32 }, bubuDir)) {
                    this.collectFlower(flower, index);
                }
            }
        });
    }

    collectFlower(flower, arrayIndex) {
        const type = flower.getData('type');
        const id = flower.getData('id');

        GameState.inventory[type] = (GameState.inventory[type] || 0) + 1;
        GameState.pickedItemsEchidna.add(id);

        // Remove from walls so Bubu can walk here now
        this.walls = this.walls.filter(w => w.x !== flower.x + 32 || w.y !== flower.y + 32);

        this.tweens.add({
            targets: flower,
            y: flower.y - 20,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                flower.destroy();
                this.flowerObjects.splice(arrayIndex, 1);
            }
        });
    }

    getFlowerType(index) {
        const types = { 2: "Yellow Flower", 3: "Blue Flower", 4: "Pink Flower" };
        return types[index] || "Unknown";
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

    handleEchidnaInteraction() {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.echidna.x, this.echidna.y);
        if (dist > 80) return;

        const bubuDir = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : '';
        const isFacingEchidna = this.checkIfFacing(this.player, this.echidna, bubuDir);
        if (!isFacingEchidna) return;

        let lines = [];
        let onCompleteAction = null;

        lines = [
            "Oh wow, I finally found an Echidna!"
        ];

        // Launch the dialogue
        this.scene.pause();
        this.scene.launch('DialogueScene', { lines: lines, onComplete: onCompleteAction });
    }
}