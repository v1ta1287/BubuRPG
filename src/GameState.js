export const GameState = {
    // Change inventory from [] to {}
    inventory: {},
    pickedItemsForest: new Set(),
    pickedItemsEchidna: new Set(),
    questStatus: 'NOT_STARTED',
    triviaStatus: 'NOT_STARTED',
    triviaStreak: 0,
    triviaQuestions: [
        { q: "What's the chemical formula for baking soda?", a: ["NaHCO3", "HCO3", "H2SO4", "CaCO3"], correct: 0 },
        { q: "When did we start dating?", a: ["December", "January", "February", "September"], correct: 2 },
        { q: "What's my favorite anime?", a: ["AOT", "Jujutsu Kaisen", "Full Metal Alchemist", "Hunter x Hunter"], correct: 2 },
        { q: "When did sharks first appear?", a: ["420 MYA (Million Years Ago)", "270 MYA", "620 MYA", "40 MYA"], correct: 0 },
        { q: "What animal is a living ancestor of Dinosaurs?", a: ["Lizards", "Crocodiles", "Sharks", "Birds"], correct: 3 },
        { q: "How far is Wilson's Prom from my house?", a: ["85KM", "140KM", "180KM", "220KM"], correct: 1 },
        { q: "What did we eat on our first date?", a: ["Lanzhou Noodles", "Dragon Hotpot", "DooBoo", "Fish and Chips"], correct: 2 },
        { q: "What is the most populous mammal in the world?", a: ["Cows", "Sheep", "Humans", "Rats"], correct: 2 },
        { q: "When was Australia Colonized?", a: ["1821", "1788", "1857", "1902"], correct: 1 },
        { q: "How cool is DubuRPG?", a: ["It's meh", "It sucks!", "It's pretty good", "Best game ever!"], correct: 3 },
    ],
    itemData: {
        "Yellow Flower": "A bright yellow daisy. It smells like sunshine.",
        "Blue Flower": "A cool blue petal. It feels slightly damp to the touch.",
        "Pink Flower": "A vibrant pink blossom. It looks very delicate.",
        "Birthday Present": "Go to this link: v1ta1287.github.io/BubuRPG/"
    }
};