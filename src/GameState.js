export const GameState = {
    // Change inventory from [] to {}
    inventory: {
        "Yellow Flower": 2,
        "Blue Flower": 5
    },
    pickedItems: new Set(),
    questStatus: 'NOT_STARTED',
    triviaStatus: 'NOT_STARTED',
    triviaSteak: 0,
    triviaQuestions: [
        { q: "What color is a sunflower?", a: ["Yellow", "Red", "Blue", "Purple"], correct: 0 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
        { q: "Do bees help flowers?", a: ["No", "Yes", "Maybe", "Only on Fridays"], correct: 1 },
    ],
    itemData: {
        "Yellow Flower": "A bright yellow daisy. It smells like sunshine.",
        "Blue Flower": "A cool blue petal. It feels slightly damp to the touch.",
        "Pink Flower": "A vibrant pink blossom. It looks very delicate."
    }
};