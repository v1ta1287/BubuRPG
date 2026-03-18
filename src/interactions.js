export function dialogueInteraction(player, npc, text, scene) {
    const dist = Phaser.Math.Distance.Between(
        player.x, player.y,
        npc.x, npc.y
    );

    if (dist < 70) {
        createDialogueWindow(scene, text);
    }
};

function createDialogueWindow(scene, text) {
    const width = 300;
    const height = 100;
    const x = (scene.cameras.main.width - width) / 2;
    const y = scene.cameras.main.height - height - 40;

    // 1. Draw the Background Rectangle
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x000000, 0.2); // Black with 80% opacity
    graphics.lineStyle(4, 0xffffff, 1); // White border
    graphics.fillRoundedRect(x, y, width, height, 15);
    graphics.strokeRoundedRect(x, y, width, height, 15);

    // 2. Add the Text
    const dialogueText = scene.add.text(x + 20, y + 20, text, {
        fontSize: '20px',
        fill: '#ffffff',
        wordWrap: { width: width - 40 }
    });

    // 3. Make it disappear after 3 seconds
    scene.time.delayedCall(3000, () => {
        graphics.destroy();
        dialogueText.destroy();
    });
}